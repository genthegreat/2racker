                    -- 'update_accounts' function
CREATE OR REPLACE FUNCTION update_accounts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update amount_due
    UPDATE accounts 
    SET amount_due = COALESCE((
        SELECT SUM(amount_due)
        FROM projects
        WHERE projects.account_id = NEW.account_id
    ), 0)
    WHERE account_id = NEW.account_id;

    -- Update paid
    UPDATE accounts
    SET amount_paid = COALESCE((
        SELECT SUM(amount_paid)
        FROM projects
        WHERE projects.account_id = NEW.account_id
    ), 0)
    WHERE account_id = NEW.account_id;

    -- Update balance 
    UPDATE accounts 
    SET balance = amount_due - amount_paid
    WHERE account_id = NEW.account_id;

    RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_projects()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total_amount_due
  UPDATE projects
  SET amount_due = COALESCE((
    SELECT SUM(default_amount)
    FROM amenities
    WHERE amenities.project_id = NEW.project_id
  ), 0)
  WHERE project_id = NEW.project_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_project_amount_paid()
RETURNS TRIGGER AS $$
BEGIN
  -- Update amount_paid for the project associated with the transaction
  UPDATE projects
  SET amount_paid = (
    SELECT COALESCE(SUM(amount_paid), 0)
    FROM transactions
    WHERE transactions.amenity_id = NEW.amenity_id
  )
  WHERE project_id = (
    SELECT project_id FROM amenities WHERE amenity_id = NEW.amenity_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;



-- Trigger to update accounts after insert, update, or delete on projects
CREATE OR REPLACE TRIGGER update_accounts_trigger
AFTER INSERT OR UPDATE OR DELETE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_accounts();

-- Trigger to update projects after insert, update, or delete on amenities
CREATE OR REPLACE TRIGGER update_projects_trigger
AFTER INSERT OR UPDATE OR DELETE ON amenities
FOR EACH ROW
EXECUTE FUNCTION update_projects();

-- Trigger to update projects after insert, update, or delete on transactions
CREATE OR REPLACE TRIGGER update_transaction_amount_paid_trigger
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_project_amount_paid();



-- RPC Function to delete project (pass project_id)
CREATE OR REPLACE FUNCTION delete_project(project_id BIGINT) RETURNS void AS $$
BEGIN

  -- Delete transactions related to the project's amenities
  DELETE FROM transactions WHERE amenity_id IN (
    SELECT amenity_id FROM amenities WHERE project_id = project_id
  );

  -- Delete amenities associated with the project
  DELETE FROM amenities WHERE project_id = project_id;
  
  -- Delete the project itself
  DELETE FROM projects WHERE project_id = project_id;

EXCEPTION WHEN FOREIGN_KEY_VIOLATION THEN
  RAISE EXCEPTION 'Project deletion failed. Ensure related transactions are deleted first.';
END;
$$ LANGUAGE plpgsql;


-- RPC Function to delete account (pass account_id)
CREATE OR REPLACE FUNCTION delete_account(account_id BIGINT) RETURNS boolean AS $$
DECLARE
  project_id BIGINT;
BEGIN
  -- Get the project_ids associated with the account
  FOR project_id IN SELECT id FROM projects WHERE account_id = account_id LOOP
    -- Call the delete_project function for each project_id (handle errors)
    BEGIN
      EXECUTE delete_project(project_id);
    EXCEPTION WHEN FOREIGN_KEY_VIOLATION THEN
      RAISE EXCEPTION 'Account deletion failed. Ensure related transactions and amenities are deleted first.';
    END;
  END LOOP;

  -- Delete the account
  DELETE FROM accounts WHERE id = account_id;

  RETURN TRUE;

EXCEPTION WHEN FOREIGN_KEY_VIOLATION THEN
  RETURN FALSE; -- Indicate failure due to foreign key constraint violation
END;
$$ LANGUAGE plpgsql;


-- RPC Function to delete amenity (pass amenity_id)
CREATE OR REPLACE FUNCTION delete_amenity(amenity_id BIGINT) RETURNS void AS $$
BEGIN

  -- Delete transactions related to the amenity
  DELETE FROM transactions WHERE amenity_id = amenity_id;

  -- Delete amenity
  DELETE FROM amenities WHERE amenity_id = amenity_id;

EXCEPTION WHEN FOREIGN_KEY_VIOLATION THEN
  RAISE EXCEPTION 'Amenity deletion failed. Ensure related transactions are deleted first.';
END;
$$ LANGUAGE plpgsql;
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


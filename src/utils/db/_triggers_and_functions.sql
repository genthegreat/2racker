-- 'update_account_amount_paid' function
BEGIN
    UPDATE accounts
    SET amount_paid = (
        SELECT COALESCE(SUM(amount_paid), 0)
        FROM projects
        WHERE projects.account_id = NEW.account_id
    )
    WHERE account_id = NEW.account_id;

    RETURN NEW; 
END;

--  'update_accounts' function
BEGIN
    -- Update amount_due
    UPDATE accounts 
    SET amount_due = COALESCE((
        SELECT SUM(amount_due)
        FROM projects
        WHERE projects.account_id = NEW.account_id
    ), 0)
    WHERE account_id = (
        SELECT account_id FROM projects WHERE account_id = NEW.account_id
    );

    -- Update balance 
    UPDATE accounts 
    SET balance = amount_due - amount_paid
    WHERE account_id = NEW.account_id;

    RETURN NEW; 
END;


-- 'update_project_amount_due' function
BEGIN
    -- Update total_amount_due
    UPDATE projects 
    SET amount_due = (
        SELECT COALESCE(SUM(default_amount), 0)
        FROM amenities
        WHERE amenities.project_id = NEW.project_id
    )
    WHERE project_id = NEW.project_id;

    -- Update balance 
    UPDATE projects 
    SET balance = amount_due - amount_paid
    WHERE project_id = NEW.project_id;

    RETURN NEW; 
END;


--  'update_project_amount_paid' function
BEGIN
    UPDATE projects
    SET amount_paid = (
        SELECT COALESCE(SUM(amount_paid), 0)
        FROM transactions
        WHERE transactions.amenity_id = NEW.amenity_id
    )
    WHERE project_id = (
        SELECT project_id FROM amenities WHERE amenity_id = NEW.amenity_id
    );
    
    -- Update balance 
    UPDATE projects 
    SET balance = amount_due - amount_paid
    WHERE project_id = (
        SELECT project_id FROM amenities WHERE amenity_id = NEW.amenity_id
    );

    RETURN NEW; 
END;



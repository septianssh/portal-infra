
DO
$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "Users") THEN
        INSERT INTO "Users" (username, email, password, roles)
        VALUES ('admin', 'admin@alt.id', 'bcrypt-hashed-pass', 'admin');
    END IF;
END
$$;

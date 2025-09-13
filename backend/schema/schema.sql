BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create sequence for invoice numbers first
CREATE SEQUENCE invoice_number_seq
    START WITH 2300
    INCREMENT BY 1
    MINVALUE 2300
    NO MAXVALUE;

CREATE TABLE IF NOT EXISTS users (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	username VARCHAR(100) NOT NULL UNIQUE,
  fullname VARCHAR(255) NOT NULL UNIQUE,
	password TEXT NOT NULL,
	role VARCHAR(20) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  active BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deactivated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS waiters (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	fullname VARCHAR(100) NOT NULL UNIQUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	active BOOLEAN DEFAULT TRUE,
	deactivated_at TIMESTAMP
);


CREATE TABLE IF NOT EXISTS categories (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name VARCHAR(100) NOT NULL UNIQUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	active BOOLEAN DEFAULT TRUE,
	deactivated_at TIMESTAMP
); 

CREATE TABLE IF NOT EXISTS products (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name VARCHAR(255) NOT NULL UNIQUE,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
	category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
	active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deactivated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID REFERENCES users(id) NOT NULL,
	waiter_id UUID REFERENCES waiters(id) NOT NULL,
	total_price NUMERIC(15, 2) NOT NULL,
--   invoice_number VARCHAR(8) NOT NULL UNIQUE DEFAULT LPAD(nextval('invoice_number_seq')::TEXT, 8, '0'),
  invoice_number VARCHAR(8) NOT NULL UNIQUE DEFAULT nextval('invoice_number_seq')::TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS order_items (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
	product_id UUID NOT NULL REFERENCES products(id),
	quantity INTEGER NOT NULL CHECK (quantity > 0),
	unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


COMMIT;


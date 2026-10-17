
-- Dữ liệu kiểm thử phục vụ chạy module đầu tiên.
-- Không phải dữ liệu khách hàng thực tế.

INSERT INTO customer
    (customer_id, full_name, phone)
VALUES
    (1, 'Khach hang kiem thu', '0900000000')
ON CONFLICT (customer_id) DO NOTHING;

INSERT INTO service_center
    (center_id, center_name, address)
VALUES
    (1, 'Trung tam kiem thu', 'Dia chi kiem thu')
ON CONFLICT (center_id) DO NOTHING;

INSERT INTO technician
    (technician_id, center_id, technician_name)
VALUES
    (1, 1, 'Ky thuat vien kiem thu')
ON CONFLICT (technician_id) DO NOTHING;

INSERT INTO ticket
    (ticket_id, customer_id, technician_id,
     center_id, status, closed_at)
VALUES
    (1, 1, 1, 1, 'CLOSED', CURRENT_TIMESTAMP)
ON CONFLICT (ticket_id) DO NOTHING;

INSERT INTO survey_response
    (response_id, ticket_id, csat_score,
     nps_score, comment, responded_at)
VALUES
    (1, 1, 5, 9,
     'Phan hoi kiem thu',
     CURRENT_TIMESTAMP)
ON CONFLICT (response_id) DO NOTHING;

-- Đồng bộ bộ đếm ID sau khi seed thủ công.
SELECT setval(
    pg_get_serial_sequence('customer', 'customer_id'),
    (SELECT MAX(customer_id) FROM customer)
);

SELECT setval(
    pg_get_serial_sequence('service_center', 'center_id'),
    (SELECT MAX(center_id) FROM service_center)
);

SELECT setval(
    pg_get_serial_sequence('technician', 'technician_id'),
    (SELECT MAX(technician_id) FROM technician)
);

SELECT setval(
    pg_get_serial_sequence('ticket', 'ticket_id'),
    (SELECT MAX(ticket_id) FROM ticket)
);

SELECT setval(
    pg_get_serial_sequence('survey_response', 'response_id'),
    (SELECT MAX(response_id) FROM survey_response)
);

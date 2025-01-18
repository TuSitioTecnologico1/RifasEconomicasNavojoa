CREATE DATABASE numeros_suerte;

USE numeros_suerte;

CREATE TABLE numeros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(5) NOT NULL,
    disponible TINYINT(1) DEFAULT 1
);


#INSERT INTO numeros (numero) VALUES ('00031'), ('00032'), ('00033'), ('00034'), ('00035'), ('00036'), ('00037'), ('00038'), ('00039'), ('00040');
#INSERT INTO numeros (numero) VALUES ('00041'), ('00042'), ('00043'), ('00044'), ('00045'), ('00046'), ('00047'), ('00048'), ('00049'), ('00050');
#INSERT INTO numeros (numero) VALUES ('00051'), ('00052'), ('00053'), ('00054'), ('00055'), ('00056'), ('00057'), ('00058'), ('00059'), ('00060');
#INSERT INTO numeros (numero) VALUES ('00061'), ('00062'), ('00063'), ('00064'), ('00065'), ('00066'), ('00067'), ('00068'), ('00069'), ('00070');
#INSERT INTO numeros (numero) VALUES ('00071'), ('00072'), ('00073'), ('00074'), ('00075'), ('00076'), ('00077'), ('00078'), ('00079'), ('00080');
#INSERT INTO numeros (numero) VALUES ('00081'), ('00082'), ('00083'), ('00084'), ('00085'), ('00086'), ('00087'), ('00088'), ('00089'), ('00090');
#INSERT INTO numeros (numero) VALUES ('00091'), ('00092'), ('00093'), ('00094'), ('00095'), ('00096'), ('00097'), ('00098'), ('00099'), ('00100');


SELECT * FROM numeros;
INSERT INTO numeros (numero) VALUES ('01000');
UPDATE numeros SET disponible = 0 WHERE id = 11;
DELETE FROM numeros WHERE id = 111;
ALTER TABLE numeros AUTO_INCREMENT = 111;

# Seguro para pedir siempre una clausa WHERE al hacer un UPDATE
SET SQL_SAFE_UPDATES = 0; # Desactivar
SET SQL_SAFE_UPDATES = 1; # Activar
UPDATE numeros SET disponible = 1;
UPDATE numeros SET disponible = 1 WHERE id = 11;
UPDATE numeros SET disponible = 1 WHERE id = 12;
UPDATE numeros SET disponible = 1 WHERE id = 13;
UPDATE numeros SET disponible = 1 WHERE id = 14;
UPDATE numeros SET disponible = 1 WHERE id = 15;



INSERT INTO states (name) VALUES
('Aguascalientes'),
('Baja California'),
('Baja California Sur'),
('Campeche'),
('Chiapas'),
('Chihuahua'),
('Coahuila'),
('Colima'),
('Durango'),
('Guanajuato'),
('Guerrero'),
('Hidalgo'),
('Jalisco'),
('México'),
('Michoacán'),
('Morelos'),
('Nayarit'),
('Nuevo León'),
('Oaxaca'),
('Puebla'),
('Querétaro'),
('Quintana Roo'),
('San Luis Potosí'),
('Sinaloa'),
('Sonora'),
('Tabasco'),
('Tamaulipas'),
('Tlaxcala'),
('Veracruz'),
('Yucatán'),
('Zacatecas');
SELECT * FROM states;
DELETE FROM states WHERE id = 1;
ALTER TABLE states AUTO_INCREMENT = 1;


USE `rt`;

USE `ims`;

INSERT INTO `vehicle_specifications` 
VALUES 
    (1,'Hyundai','i20',NULL,114.00,5),
    (2,'Ford','Galaxy',NULL,166.00,7),
    (3,'Mazda','MX5',NULL,212.50,2),
    (4,'MG','F',NULL,55.00,2);

INSERT INTO `vehicles` 
VALUES 
    ('AA00 AAA',1),
    ('AA00 AAB',1),
    ('AA00 AAC',2),
    ('AA00 AAD',3),
    ('AA00 AAE',4),
    ('AA00 AAF',4);

--Creamos un uuario CRUD PARA el proyecto
CREATE LOGIN CRUDBA
WITH PASSWORD = 'DylanCRUD';

CREATE USER CRUDBA FOR LOGIN CRUDBA;

ALTER USER CRUDBA
WITH DEFAULT_SCHEMA = DA;

GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::DA TO CRUDBA;


GRANT EXECUTE ON SCHEMA::DA TO CRUDBA;
GO


--cREAMOS PROCEDIMIENTOS ALMACENADOS PARA LAS ORDENES 
CREATE PROCEDURE DA.ManageOrders
    @Action NVARCHAR(10), -- 'INSERT', 'UPDATE', 'DELETE'
    @OrderUuid UNIQUEIDENTIFIER = NULL, 
    @UserUuid UNIQUEIDENTIFIER = NULL, 
    @TotalAmount DECIMAL(10, 2) = NULL,
    @StatusUuid UNIQUEIDENTIFIER = NULL, 
    @OrderDetails NVARCHAR(MAX) = NULL 
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

    BEGIN TRY
      
        IF @Action = 'INSERT'
        BEGIN
            -- Insertamos la orden
            DECLARE @NewOrderUuid UNIQUEIDENTIFIER = NEWID();

            INSERT INTO DA.ORDERS (Uuid, UserUuid, TotalAmount, StatusUuid, CreatedAt, UpdateAt)
            VALUES (@NewOrderUuid, @UserUuid, @TotalAmount, @StatusUuid, GETDATE(), GETDATE());

            -- Insertamos los detalles en fomato Json
            IF @OrderDetails IS NOT NULL
            BEGIN
                INSERT INTO DA.ORDERDETAILS (Uuid, OrderUuid, ProductUuuid, Quantity, SubTotal, CreatedAt, UpdateAt)
                SELECT NEWID(), @NewOrderUuid, ProductUuid, Quantity, SubTotal, GETDATE(), GETDATE()
                FROM OPENJSON(@OrderDetails)
                WITH (
                    ProductUuid UNIQUEIDENTIFIER,
                    Quantity INT,
                    SubTotal DECIMAL(10, 2)
                );
            END;
        END
        ELSE IF @Action = 'UPDATE'
        BEGIN
            -- Actualizamos el encabezado de la orden
            UPDATE DA.ORDERS
            SET UserUuid = @UserUuid,
                TotalAmount = @TotalAmount,
                StatusUuid = @StatusUuid,
                UpdateAt = GETDATE()
            WHERE Uuid = @OrderUuid;

            -- Borramos y volvermos a insertar
            IF @OrderDetails IS NOT NULL
            BEGIN
                DELETE FROM DA.ORDERDETAILS WHERE OrderUuid = @OrderUuid;

                INSERT INTO DA.ORDERDETAILS (Uuid, OrderUuid, ProductUuuid, Quantity, SubTotal, CreatedAt, UpdateAt)
                SELECT NEWID(), @OrderUuid, ProductUuid, Quantity, SubTotal, GETDATE(), GETDATE()
                FROM OPENJSON(@OrderDetails)
                WITH (
                    ProductUuid UNIQUEIDENTIFIER,
                    Quantity INT,
                    SubTotal DECIMAL(10, 2)
                );
            END;
        END
        ELSE IF @Action = 'DELETE'
        BEGIN
            -- Eliminar detalles primero 
            DELETE FROM DA.ORDERDETAILS WHERE OrderUuid = @OrderUuid;

            -- Eliminar encabezado de la orden
            DELETE FROM DA.ORDERS WHERE Uuid = @OrderUuid;
        END
        ELSE
        BEGIN
            RAISERROR('Invalid Action. Use INSERT, UPDATE, or DELETE.', 16, 1);
        END;

        -- Confirmamos que la transacci�n fue exitosa
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback en caso de error
        ROLLBACK TRANSACTION;

        -- Lanzar el error para depuraci�n
        THROW;
    END CATCH
END;
GO


--Creamos vistas para consulta de ordenes

CREATE VIEW DA.AllOrdersWithDetails AS
SELECT 
    o.Uuid AS OrderUuid,
    o.UserUuid,
    u.FullName AS UserName,
    o.TotalAmount,
    o.StatusUuid,
    s.Name AS StatusName,
    o.CreatedAt AS OrderCreatedAt,
    o.UpdateAt AS OrderUpdatedAt,
    od.Uuid AS OrderDetailUuid,
    od.ProductUuuid,
    p.Name AS ProductName,
    p.Brand AS ProductBrand,
    od.Quantity,
    od.SubTotal
FROM 
    DA.ORDERS o
INNER JOIN DA.USERS u ON o.UserUuid = u.Uuid
INNER JOIN DA.STATUS s ON o.StatusUuid = s.Uuid
LEFT JOIN DA.ORDERDETAILS od ON o.Uuid = od.OrderUuid
LEFT JOIN DA.PRODUCTS p ON od.ProductUuuid = p.Uuid;
GO

--prueba
SELECT * FROM DA.AllOrdersWithDetails;
GO


CREATE PROCEDURE DA.GetOrderWithDetails
    @OrderUuid UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        o.Uuid AS OrderUuid,
        o.UserUuid,
        u.FullName AS UserName,
        o.TotalAmount,
        o.StatusUuid,
        s.Name AS StatusName,
        o.CreatedAt AS OrderCreatedAt,
        o.UpdateAt AS OrderUpdatedAt,
        od.Uuid AS OrderDetailUuid,
        od.ProductUuuid,
        p.Name AS ProductName,
        p.Brand AS ProductBrand,
        od.Quantity,
        od.SubTotal
    FROM 
        DA.ORDERS o
    INNER JOIN DA.USERS u ON o.UserUuid = u.Uuid
    INNER JOIN DA.STATUS s ON o.StatusUuid = s.Uuid
    LEFT JOIN DA.ORDERDETAILS od ON o.Uuid = od.OrderUuid
    LEFT JOIN DA.PRODUCTS p ON od.ProductUuuid = p.Uuid
    WHERE 
        o.Uuid = @OrderUuid;
END;
GO

--PRUEBA
EXEC DA.GetOrderWithDetails @OrderUuid = 'FA0CA280-97F4-4133-B07F-2B78E8840493';

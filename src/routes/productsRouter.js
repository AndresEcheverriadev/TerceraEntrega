import { Router } from "express";
import { ProductDao } from "../daos/index.js";

const productsRouter = Router();

const ProductApi = ProductDao;

const isAdmin = true;
const errorHandles = {
  noAdmin : 'Usuario no autorizado',
  noCart : 'Carrito no encontrado',
  noProduct : 'Producto no encontrado'
};

const adminState = (req, res, next) => {
    if (!isAdmin) res.send({ error: errorHandles.noAdmin });
    next();
};

productsRouter.get("/", async (req, res) => {
try {
    const AllProducts = await ProductApi.listarTodo();
    res.send(AllProducts);
} catch (error) {
    res.send(error);
}
});

productsRouter.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    const filteredProduct = await ProductApi.listarPorId(id);

    if (!filteredProduct) res.send({ error: errorHandles.noProduct });

    res.send(filteredProduct);
} catch (error) {
    res.send(error);
}
});

productsRouter.post("/", adminState, async (req, res) => {
try {
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;

    const product = ({
    nombre,
    descripcion,
    codigo,
    foto,
    precio,
    stock,
    });

    const savedProduct = await ProductApi.crearElemento(product);

    res.send(savedProduct);
} catch (error) {
    res.send(error);
}
});

productsRouter.put("/:id", adminState, async (req, res) => {
try {
    const { id } = req.params;
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;

    const product = ({
    nombre,
    descripcion,
    codigo,
    foto,
    precio,
    stock,
    });

    const UpdatedProduct = await ProductApi.actualizarElemento(id,product);

    res.send(UpdatedProduct);
} catch (error) {
    res.send(error);
}
});

productsRouter.delete("/:id",adminState, async (req, res) => {
try {
    const { id } = req.params;

    const deletedProduct = await ProductApi.borrarPorId(id);

    if (!deletedProduct ) res.send({ error: errorHandles.noProduct });

    res.send(deletedProduct);
} catch (error) {
    res.send(error);
}
});

export { productsRouter }
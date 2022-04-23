type Product = {
    id: string,
    description: string,
    imageUrl: string,
    numInStock: number,
    name: string,
    price: number
}

type CartItem = {
    product: Product,
    qty: number
}

export { Product, CartItem };
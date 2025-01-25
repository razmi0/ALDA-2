export type ProductImage = {
    label: Product["title"];
    src: ImageMetadata;
    alt: string;
    size: number[];
};
export interface ProductData {
    poles: Poles;
    products: Product[];
}

export interface Poles {
    available: number[];
    all: All[];
}

export interface All {
    id: number;
    label: string;
}

export interface Product {
    id: number;
    title: string;
    pole: string;
    tags?: string[];
    description?: string;
    price?: string;
    program?: string;
    audience?: string;
    locations?: string;
    subproducts?: Subproduct[];
}

export interface Subproduct {
    id: number;
    title: string;
    theme: string;
    description: string;
}

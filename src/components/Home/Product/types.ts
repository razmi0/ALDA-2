export type ProductImage = {
    key: string;
    src: ImageMetadata;
    alt: string;
    width: number;
    height: number;
};
export interface ProductData {
    poles: Poles;
    products: Product[];
}

interface Poles {
    enabledPoleIds: number[];
    enabledProductIds: number[];
    all: All[];
}

interface All {
    id: number;
    label: string;
}

export interface Product {
    id: number;
    title: string;
    pole: string;
    imageKey?: string;
    tags?: string[];
    description?: string;
    price?: string;
    program?: string[] | string;
    audience?: string;
    locations?: string;
    subproducts?: Subproduct[];
}

interface Subproduct {
    id: number;
    title: string;
    imageKey?: string;
    theme: string;
    description: string;
    program?: string[] | string;
    duration?: string;
}

import React, { useState } from 'react';
import { useProducts } from '../../App';
import { useToast } from '../../components/ToastProvider';
import { Product } from '../../types';

const Modal: React.FC<{ children: React.ReactNode, onClose: () => void, title: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold text-black">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        {children}
      </div>
    </div>
);

const allSizes = ['S', 'M', 'L', 'XL'];

const ProductForm: React.FC<{ onSave: (product: Omit<Product, 'id'>) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [colors, setColors] = useState('');
    const [material, setMaterial] = useState('');
    const [keywords, setKeywords] = useState('');
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [sizeStock, setSizeStock] = useState<{ [key: string]: number }>({});
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const inputClass = "w-full rounded-md border border-gray-300 p-3 text-black shadow-sm focus:border-black focus:ring-0 focus:outline-none transition-colors";
    const labelClass = "block text-sm font-medium text-gray-700 mb-2";

    const handleSizeChange = (size: string) => {
        const newSizes = selectedSizes.includes(size)
            ? selectedSizes.filter(s => s !== size)
            : [...selectedSizes, size];
        setSelectedSizes(newSizes);
    };

    const handleStockChange = (size: string, stock: number) => {
        setSizeStock(prev => ({ ...prev, [size]: stock }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // FIX: Used spread syntax to convert FileList to an array, ensuring correct type inference for `URL.createObjectURL`.
            const files = [...e.target.files];
            setImageFiles(files);

            const previews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(previews);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const imageUrls = await Promise.all(imageFiles.map(fileToBase64));
        const totalStock = selectedSizes.reduce((acc, size) => acc + (sizeStock[size] || 0), 0);

        const newProduct: Omit<Product, 'id'> = {
            name, price, description, material,
            colors: colors.split(',').map(c => c.trim()).filter(Boolean),
            keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
            sizes: selectedSizes,
            sizeStock,
            stock: totalStock,
            imageUrls,
        };
        onSave(newProduct);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div>
                    <label htmlFor="product-name" className={labelClass}>Product Name</label>
                    <input id="product-name" type="text" placeholder="e.g. Void Echo Tee" value={name} onChange={e => setName(e.target.value)} required className={inputClass} />
                </div>
                 <div>
                    <label htmlFor="product-description" className={labelClass}>Description</label>
                    <textarea id="product-description" placeholder="A short, compelling description..." value={description} onChange={e => setDescription(e.target.value)} rows={4} required className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="product-price" className={labelClass}>Price</label>
                        <input id="product-price" type="number" placeholder="e.g. 120" value={price} onChange={e => setPrice(parseFloat(e.target.value))} min="0" step="0.01" required className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="product-material" className={labelClass}>Material</label>
                        <input id="product-material" type="text" placeholder="e.g. Heavyweight Cotton" value={material} onChange={e => setMaterial(e.target.value)} required className={inputClass} />
                    </div>
                </div>
                 <div>
                    <label htmlFor="product-colors" className={labelClass}>Colors</label>
                    <input id="product-colors" type="text" placeholder="Comma-separated, e.g. Black, White" value={colors} onChange={e => setColors(e.target.value)} required className={inputClass} />
                </div>
                 <div>
                    <label htmlFor="product-keywords" className={labelClass}>Keywords for Search</label>
                    <input id="product-keywords" type="text" placeholder="Comma-separated, e.g. minimalist, essential" value={keywords} onChange={e => setKeywords(e.target.value)} required className={inputClass} />
                </div>
                
                <div>
                    <label className={labelClass}>Sizes</label>
                    <div className="flex gap-4">
                        {allSizes.map(size => (
                            <div key={size} className="flex items-center">
                                <input type="checkbox" id={`size-${size}`} checked={selectedSizes.includes(size)} onChange={() => handleSizeChange(size)} className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                                <label htmlFor={`size-${size}`} className="ml-2 text-sm text-black">{size}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedSizes.length > 0 && (
                    <div>
                        <label className={labelClass}>Stock for each size</label>
                        <div className="grid grid-cols-4 gap-4">
                            {selectedSizes.sort().map(size => (
                                <div key={size}>
                                    <label htmlFor={`stock-${size}`} className="text-xs font-bold text-gray-500">{size}</label>
                                    <input type="number" id={`stock-${size}`} placeholder="0" min="0" onChange={e => handleStockChange(size, parseInt(e.target.value))} className={`${inputClass} mt-1`} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div>
                    <label htmlFor="product-images" className={labelClass}>Product Images</label>
                    <input id="product-images" type="file" multiple accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200" />
                    <div className="mt-4 flex gap-4 flex-wrap">
                        {imagePreviews.map((src, index) => <img key={index} src={src} alt={`Preview ${index}`} className="h-24 w-24 object-cover rounded-md" />)}
                    </div>
                </div>
            </div>
            <div className="p-6 bg-gray-50 border-t flex justify-end gap-4 rounded-b-xl">
                 <button type="button" onClick={onCancel} className="bg-white text-black border border-gray-300 font-semibold py-2 px-5 rounded-lg hover:bg-gray-100 transition-all text-sm shadow-sm">
                    Cancel
                </button>
                <button type="submit" className="bg-black text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-800 transition-all text-sm shadow-sm">
                    Save Product
                </button>
            </div>
        </form>
    );
};

const AdminProducts: React.FC = () => {
    const { products, addProduct } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { addToast } = useToast();
    
    const filteredProducts = products.filter(product => {
        const query = searchQuery.toLowerCase();
        return (
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.keywords.some(k => k.toLowerCase().includes(query))
        );
    });

    const handleSaveProduct = (newProductData: Omit<Product, 'id'>) => {
        addProduct(newProductData);
        addToast('Product added successfully!', 'success');
        setIsModalOpen(false);
    };

    const handleDeleteProduct = () => {
        addToast('Product deleted! (This is a demo and does not actually remove the product)', 'info');
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
                <div className="border-b border-gray-200/80 px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-black">Product Management</h2>
                        <p className="text-sm text-gray-500 mt-1">View, add, edit, or delete products.</p>
                    </div>
                     <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-black text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                            />
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-black text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-800 transition-all text-sm shadow-sm flex-shrink-0">
                            Add Product
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto horizontal-scrollbar">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">Product</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Price</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Stock</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Colors</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/80">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <img src={product.imageUrls[0]} alt={product.name} className="w-12 h-16 object-cover rounded-md bg-gray-100"/>
                                                <span className="font-semibold text-black">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 whitespace-nowrap">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-gray-800 whitespace-nowrap">{product.stock}</td>
                                        <td className="px-6 py-4 text-gray-800 whitespace-nowrap">{product.colors.join(', ')}</td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-4">
                                            <button className="font-semibold text-black hover:underline">Edit</button>
                                            <button onClick={handleDeleteProduct} className="font-semibold text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))
                             ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-16 px-6">
                                        <div className="text-gray-500">
                                            <p className="font-semibold">No products found</p>
                                            <p className="text-sm mt-1">Try adjusting your search query.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} title="Add New Product">
                    <ProductForm onSave={handleSaveProduct} onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </>
    );
};

export default AdminProducts;
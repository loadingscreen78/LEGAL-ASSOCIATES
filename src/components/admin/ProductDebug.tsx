import { useProducts } from '@/hooks/useProducts';

export const ProductDebug = () => {
  const { products } = useProducts();

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg max-w-4xl mx-auto my-4">
      <h2 className="text-xl font-bold mb-4">🔍 Product Debug Info</h2>
      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="border border-gray-700 p-3 rounded">
            <p><strong>ID:</strong> {product.id}</p>
            <p><strong>Title:</strong> {product.title}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Image URL:</strong> {product.image_url || '❌ NO IMAGE URL'}</p>
            {product.image_url && (
              <div className="mt-2">
                <p className="text-sm text-gray-400 mb-1">Image Preview:</p>
                <img 
                  src={product.image_url} 
                  alt={product.title}
                  className="w-32 h-32 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=Error';
                    console.error('Image failed to load:', product.image_url);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

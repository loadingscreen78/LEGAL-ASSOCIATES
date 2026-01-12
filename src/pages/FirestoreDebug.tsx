import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FirestoreDebug = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Fetching products from Firestore...');
        const querySnapshot = await getDocs(collection(db, 'products'));
        console.log('🔍 Query snapshot size:', querySnapshot.size);
        
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('🔍 Products data:', productsData);
        setProducts(productsData);
      } catch (err: any) {
        console.error('❌ Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>🔍 Firestore Debug - Products Collection</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4">Loading products from Firebase...</p>
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
                  <h3 className="font-bold mb-2">Error:</h3>
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && (
                <div className="space-y-4">
                  <div className="bg-primary/10 border border-primary p-4 rounded-md">
                    <h3 className="font-bold mb-2">Total Products: {products.length}</h3>
                  </div>

                  {products.length === 0 ? (
                    <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-700 dark:text-yellow-400 p-4 rounded-md">
                      <h3 className="font-bold mb-2">⚠️ No Products Found</h3>
                      <p>The products collection is empty. You need to:</p>
                      <ol className="list-decimal ml-6 mt-2 space-y-1">
                        <li>Login as admin</li>
                        <li>Go to Admin Dashboard → Products</li>
                        <li>Click "Add Product" to create products</li>
                        <li>Fill in the product details and save</li>
                      </ol>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.map((product, index) => (
                        <div key={product.id} className="border border-border p-4 rounded-md">
                          <h4 className="font-bold text-lg mb-2">Product #{index + 1}</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><strong>ID:</strong> {product.id}</div>
                            <div><strong>Title:</strong> {product.title || 'N/A'}</div>
                            <div><strong>Category:</strong> {product.category || 'N/A'}</div>
                            <div><strong>Price:</strong> ₹{product.price || 0}</div>
                            <div><strong>Stock:</strong> {product.stock || 0}</div>
                            <div><strong>Active:</strong> {product.is_active ? 'Yes' : 'No'}</div>
                            <div className="col-span-2"><strong>Author:</strong> {product.author || 'N/A'}</div>
                            <div className="col-span-2"><strong>Description:</strong> {product.description || 'N/A'}</div>
                            <div className="col-span-2">
                              <strong>Image URL:</strong> 
                              {product.image_url ? (
                                <div className="mt-2">
                                  <a href={product.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                                    {product.image_url}
                                  </a>
                                  <img src={product.image_url} alt={product.title} className="mt-2 max-w-xs rounded-md" />
                                </div>
                              ) : (
                                <span className="text-muted-foreground"> No image</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FirestoreDebug;

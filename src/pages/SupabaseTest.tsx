import { useState, useEffect } from 'react';
import { testSupabaseConnection, getSupabaseInfo } from '@/lib/supabaseTest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

export default function SupabaseTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTests = async () => {
    setTesting(true);
    setResults(null);
    
    // Show info first
    getSupabaseInfo();
    
    // Run tests
    const testResults = await testSupabaseConnection();
    setResults(testResults);
    setTesting(false);
  };

  useEffect(() => {
    // Auto-run tests on mount
    runTests();
  }, []);

  const StatusIcon = ({ status }: { status: boolean }) => {
    if (status) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#1e293b' }}>
            Supabase Connection Test
          </h1>
          <p style={{ color: '#64748b' }}>
            Verify your Supabase configuration for Auth, Database, and Storage
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Configuration</span>
              <Button
                onClick={runTests}
                disabled={testing}
                variant="outline"
                size="sm"
              >
                {testing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-test
                  </>
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              Supabase Project: wvptkawpgmccgsqjkwls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#f8fafc' }}>
                <span className="font-medium">URL</span>
                <code className="text-sm" style={{ color: '#64748b' }}>
                  {import.meta.env.VITE_SUPABASE_URL || 'Not configured'}
                </code>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#f8fafc' }}>
                <span className="font-medium">Anon Key</span>
                <code className="text-sm" style={{ color: '#64748b' }}>
                  {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {results && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  {results.connection && results.auth && results.database && results.storage
                    ? '🎉 All tests passed!'
                    : '⚠️ Some tests failed'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: results.connection ? '#d1fae5' : '#fee2e2' }}>
                    <div className="flex items-center gap-3">
                      <StatusIcon status={results.connection} />
                      <div>
                        <p className="font-semibold">Connection</p>
                        <p className="text-sm" style={{ color: '#64748b' }}>
                          Basic connectivity to Supabase
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: results.auth ? '#d1fae5' : '#fee2e2' }}>
                    <div className="flex items-center gap-3">
                      <StatusIcon status={results.auth} />
                      <div>
                        <p className="font-semibold">Authentication</p>
                        <p className="text-sm" style={{ color: '#64748b' }}>
                          Auth service is accessible
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: results.database ? '#d1fae5' : '#fee2e2' }}>
                    <div className="flex items-center gap-3">
                      <StatusIcon status={results.database} />
                      <div>
                        <p className="font-semibold">Database</p>
                        <p className="text-sm" style={{ color: '#64748b' }}>
                          PostgreSQL tables are accessible
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: results.storage ? '#d1fae5' : '#fee2e2' }}>
                    <div className="flex items-center gap-3">
                      <StatusIcon status={results.storage} />
                      <div>
                        <p className="font-semibold">Storage</p>
                        <p className="text-sm" style={{ color: '#64748b' }}>
                          Products bucket is configured
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {results.errors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Issues Found</CardTitle>
                  <CardDescription>
                    Fix these issues to complete the setup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.errors.map((error: string, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border-l-4"
                        style={{ background: '#fef3c7', borderColor: '#f59e0b' }}
                      >
                        <p className="font-medium" style={{ color: '#92400e' }}>
                          {index + 1}. {error}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-lg" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                    <p className="font-semibold mb-2" style={{ color: '#0c4a6e' }}>
                      Quick Fix Guide:
                    </p>
                    <ul className="space-y-2 text-sm" style={{ color: '#0369a1' }}>
                      <li>• <strong>Database tables:</strong> Run SUPABASE_DATABASE_SCHEMA.sql in SQL Editor</li>
                      <li>• <strong>Storage bucket:</strong> Create 'products' bucket in Storage section</li>
                      <li>• <strong>Auth issues:</strong> Enable Email provider in Authentication</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {testing && (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#D4AF37' }} />
                <p className="text-lg font-medium" style={{ color: '#1e293b' }}>
                  Running tests...
                </p>
                <p className="text-sm" style={{ color: '#64748b' }}>
                  This may take a few seconds
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 p-6 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
          <h3 className="font-bold mb-3" style={{ color: '#1e293b' }}>
            Next Steps:
          </h3>
          <ol className="space-y-2 text-sm" style={{ color: '#64748b' }}>
            <li>1. If database test fails: Run <code className="px-2 py-1 rounded" style={{ background: '#f1f5f9' }}>SUPABASE_DATABASE_SCHEMA.sql</code></li>
            <li>2. If storage test fails: Create 'products' bucket in Supabase Dashboard</li>
            <li>3. Once all tests pass, you're ready to use the app!</li>
            <li>4. Check the browser console for detailed logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

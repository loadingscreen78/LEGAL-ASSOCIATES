import { supabase } from './supabaseClient';

/**
 * Test Supabase connection and configuration
 */
export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  const results = {
    connection: false,
    auth: false,
    database: false,
    storage: false,
    errors: [] as string[]
  };

  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      results.errors.push(`Session check failed: ${sessionError.message}`);
    } else {
      results.connection = true;
      results.auth = true;
      console.log('✅ Connection successful');
      console.log('📝 Current session:', session ? 'Logged in' : 'Not logged in');
    }

    // Test 2: Database access (check if tables exist)
    console.log('2️⃣ Testing database access...');
    try {
      const { data, error: dbError } = await supabase
        .from('products')
        .select('count')
        .limit(1);
      
      if (dbError) {
        if (dbError.code === '42P01') {
          results.errors.push('Database tables not created yet. Run SUPABASE_DATABASE_SCHEMA.sql');
        } else {
          results.errors.push(`Database error: ${dbError.message}`);
        }
      } else {
        results.database = true;
        console.log('✅ Database access successful');
      }
    } catch (dbErr: any) {
      results.errors.push(`Database test failed: ${dbErr.message}`);
    }

    // Test 3: Storage access
    console.log('3️⃣ Testing storage access...');
    try {
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      
      if (storageError) {
        results.errors.push(`Storage error: ${storageError.message}`);
      } else {
        const productsBucket = buckets?.find(b => b.name === 'products');
        if (productsBucket) {
          results.storage = true;
          console.log('✅ Storage access successful');
          console.log('📦 Products bucket found:', productsBucket.public ? 'Public' : 'Private');
        } else {
          results.errors.push('Products bucket not found. Create it in Supabase Dashboard → Storage');
        }
      }
    } catch (storageErr: any) {
      results.errors.push(`Storage test failed: ${storageErr.message}`);
    }

    // Summary
    console.log('\n📊 Test Results:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Connection: ${results.connection ? '✅' : '❌'}`);
    console.log(`Auth: ${results.auth ? '✅' : '❌'}`);
    console.log(`Database: ${results.database ? '✅' : '❌'}`);
    console.log(`Storage: ${results.storage ? '✅' : '❌'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (results.errors.length > 0) {
      console.log('\n⚠️ Issues found:');
      results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (results.connection && results.auth && results.database && results.storage) {
      console.log('\n🎉 All tests passed! Supabase is fully configured.');
    } else {
      console.log('\n⚠️ Some tests failed. Check the errors above.');
    }

    return results;
  } catch (error: any) {
    console.error('❌ Test failed:', error);
    results.errors.push(`Unexpected error: ${error.message}`);
    return results;
  }
}

/**
 * Get Supabase project info
 */
export function getSupabaseInfo() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('📋 Supabase Configuration:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`URL: ${url}`);
  console.log(`Anon Key: ${hasKey ? '✅ Configured' : '❌ Missing'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (url) {
    const projectId = url.split('//')[1]?.split('.')[0];
    console.log(`Project ID: ${projectId}`);
    console.log(`Dashboard: https://supabase.com/dashboard/project/${projectId}`);
  }
}

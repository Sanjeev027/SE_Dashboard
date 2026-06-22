const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('Migrating central -> central_admin');
    const { data: d1, error: e1 } = await supabase.from('users').update({ role: 'central_admin' }).eq('role', 'central');
    if (e1) console.error(e1);
    
    console.log('Migrating manager -> campus_admin');
    const { data: d2, error: e2 } = await supabase.from('users').update({ role: 'campus_admin' }).eq('role', 'manager');
    if (e2) console.error(e2);
    
    console.log('Done.');
}

migrate();

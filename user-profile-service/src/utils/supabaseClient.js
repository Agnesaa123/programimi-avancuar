const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vppnlpyctgobmyvbrdkx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcG5scHljdGdvYm15dmJyZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzM3OTksImV4cCI6MjA1OTg0OTc5OX0.OK6P4FI0R5DqiFNiBwZhCjfOmOiRGw9uMAQscLIMR3I';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

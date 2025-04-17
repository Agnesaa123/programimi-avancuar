const express = require('express');
const app = express();
const port = 3001;

// Middleware për JSON
app.use(express.json());

// Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://vppnlpyctgobmyvbrdkx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcG5scHljdGdvYm15dmJyZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzM3OTksImV4cCI6MjA1OTg0OTc5OX0.OK6P4FI0R5DqiFNiBwZhCjfOmOiRGw9uMAQscLIMR3I';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Endpoint-e ---

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Supabase error (GET all):', error);
      return res.status(500).json({ message: 'Gabim gjatë marrjes së produkteve', error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Server error (GET all):', err);
    res.status(500).json({ message: 'Gabim i serverit', error: err.message });
  }
});

// GET product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'ID duhet të jetë numër' });
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Produkti nuk u gjet' });
      }
      console.error(`Supabase error (GET /${productId}):`, error);
      return res.status(500).json({ message: 'Gabim gjatë marrjes së produktit', error: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: 'Produkti nuk u gjet' });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error (GET /:id):', err);
    res.status(500).json({ message: 'Gabim i serverit', error: err.message });
  }
});

// POST product
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Emri dhe çmimi janë të detyrueshëm' });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ message: 'Çmimi duhet të jetë numër pozitiv' });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ name, price, description: description || null }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error (POST):', error);
      return res.status(500).json({ message: 'Gabim gjatë shtimit të produktit', error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Server error (POST):', err);
    res.status(500).json({ message: 'Gabim i serverit', error: err.message });
  }
});

// PUT product
app.put('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, price, description } = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({ message: 'ID duhet të jetë numër' });
    }

    if (name === undefined && price === undefined && description === undefined) {
      return res.status(400).json({ message: 'Duhet të jepet të paktën një fushë për përditësim' });
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return res.status(400).json({ message: 'Çmimi duhet të jetë numër pozitiv' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (description !== undefined) updateData.description = description;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Produkti nuk u gjet për përditësim' });
      }
      console.error(`Supabase error (PUT /${productId}):`, error);
      return res.status(500).json({ message: 'Gabim gjatë përditësimit', error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error (PUT /:id):', err);
    res.status(500).json({ message: 'Gabim i serverit', error: err.message });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'ID duhet të jetë numër' });
    }

    const { data, error, count } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error(`Supabase error (DELETE /${productId}):`, error);
      return res.status(500).json({ message: 'Gabim gjatë fshirjes', error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Produkti nuk u gjet për t\'u fshirë' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Server error (DELETE /:id):', err);
    res.status(500).json({ message: 'Gabim i serverit', error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Serveri po dëgjon në http://localhost:${port}`);
  console.log(`🔗 Endpoint-et e API-t: http://localhost:${port}/api/products`);
});

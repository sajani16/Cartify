import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, role } = useSelector((state) => state.user);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: null,
    oldImage: "",
  });

  useEffect(() => {
    if (role !== "admin") navigate("/");

    async function fetchProduct() {
      const res = await axios.get(
        `http://localhost:3000/product/getProduct/${id}`
      );
      const p = res.data.product;

      setProduct({
        name: p.name,
        price: p.price,
        stock: p.stock,
        category: p.category,
        image: null,
        oldImage: p.image,
      });
    }

    fetchProduct();
  }, [id, role]);

  async function handleUpdate(e) {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:3000/product/updateProduct/${id}`,
        product,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);

      if (res.data.success) {
        alert("Product updated");
        navigate(`/productdetail/${id}`);
      }
    } catch (err) {
      alert("Update failed");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this product permanently?")) return;

    try {
      await axios.delete(`http://localhost:3000/product/deleteProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Deleted");
      navigate("/products");
    } catch {
      alert("Delete failed");
    }
  }

  return (
    <div className="bg-[#0B1F3A] min-h-screen flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Edit Product</h2>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            type="number"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            type="text"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            className="border p-2 rounded"
          />

          {/* Image Preview */}
          <label className="cursor-pointer">
            {product.image ? (
              <img
                src={URL.createObjectURL(product.image)}
                className="w-full h-48 object-cover rounded"
              />
            ) : (
              <img
                src={product.oldImage}
                className="w-full h-48 object-cover rounded"
              />
            )}
            <input
              type="file"
              hidden
              onChange={(e) =>
                setProduct({ ...product, image: e.target.files[0] })
              }
            />
          </label>

          <button
            type="submit"
            className="bg-yellow-500 text-[#0B1F3A] py-2 rounded font-semibold"
          >
            Update Product
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="border border-red-500 text-red-600 py-2 rounded"
          >
            Delete Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;

"use client"

import { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import { Post } from '../types/post';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description,setDescription] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const API_URL = 'http://localhost:8100/posts';

  // Fetch posts from the API on initial load
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<Post[]>(API_URL);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Handle form submission for create/update
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null) {
      // Update post
      try {
        await axios.put<Post>(`${API_URL}/${posts[editingIndex].id}`, { title,description });
        const updatedPosts = posts.map((post, index) =>
          index === editingIndex ? { ...post, title, } : post
        );
        setPosts(updatedPosts);
        setEditingIndex(null);
      } catch (error) {
        console.error('Error updating post:', error);
      }
    } else {
      // Create new post
      try {
        const response = await axios.post<Post>(API_URL, { title,description });
        setPosts([...posts, response.data]);
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
    setTitle('');
    setDescription('');
  };

  // Handle post delete
  const handleDelete = async (index: number) => {
    try {
      await axios.delete(`${API_URL}/${posts[index].id}`);
      const updatedPosts = posts.filter((_, i) => i !== index);
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Handle post edit
  const handleEdit = (index: number) => {
    setTitle(posts[index].title);
    setEditingIndex(index);
    setDescription(posts[index].description)
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-stone-950">Posts</h1>

      {/* List of Posts */}
      <div className="mb-4">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div
              key={post.id}
              className="flex justify-between items-center border-b border-black-300 p-2"
            >
                <div className='flex-column'>
              <span className='text-stone-950'>{post.title}</span>
              <br/>
              <span className='text-stone-950'>{post.description}</span>
                </div>
              <div>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-black-500">No posts available.</p>
        )}
      </div>

      {/* Form to Create/Edit Post */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="p-2 border border-black-300 rounded text-stone-950"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter post description"
          className="p-2 border border-black-300 rounded text-stone-950"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {editingIndex !== null ? 'Update Post' : 'Add Post'}
        </button>

        {editingIndex != null && (
            <div>
                <button
                onClick={()=>{
                    setEditingIndex(null)
                    setTitle("")
                    setDescription("")
                }}

                className='bg-blue-500 text-white px-2 py-1 rounded mr-2'
                >
                    cancel edit
                </button>
            </div>
        )}
      </form>
    </div>
  );
}

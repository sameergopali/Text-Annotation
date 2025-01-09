const Placeholder = () => { 
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="text-blue-500 text-4xl mb-4">Welcome to the Placeholder Page</h2>
        <p className="text-gray-700 text-lg">This is a placeholder page. More content will be added soon.</p>
        <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Learn More
        </button>
      </div>
    </div>
  );
}

export default Placeholder;
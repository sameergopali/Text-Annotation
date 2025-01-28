function Table({ comparisons, users, type }) {
  if (!users || users.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No annotators selected. Please choose annotators to compare.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border bg-gray-50">Type</th>
            {users.map(user => (
              <th key={user} className="p-2 border bg-gray-50">{user}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisons && comparisons.length > 0 ? (
            comparisons.map((item, index) => (
              <tr key={index}>
                <td className="p-2 border capitalize">{type.toLowerCase()}</td>
                {users.map(user => {
                  const label = item.find(l => l.user === user);
                  return (
                    <td key={user} className="p-2 border">
                      {label ? (
                        <>
                          Text: {label.text}<br/>
                          Codes: {label.codes.join('::')}
                          {label.score && <><br/>Score: {label.score.toFixed(2)}</>}
                        </>
                      ) : '-'}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={users.length + 1} className="p-4 text-center text-gray-500">
                No {type.toLowerCase()} found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
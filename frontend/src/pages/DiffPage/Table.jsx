function Table({ comparisons }) {
  console.log("comparisons", comparisons);
return (<div className="overflow-x-auto">
<table className="w-full border-collapse">
  <thead>
    <tr>
      <th className="p-2 border bg-gray-50">Type</th>
      <th className="p-2 border bg-gray-50">Annotator 1</th>
      <th className="p-2 border bg-gray-50">Annotator 2</th>
      <th className="p-2 border bg-gray-50">Codes</th>
    </tr>
  </thead>
  <tbody>
    {comparisons && comparisons.length>0 && comparisons.map((item, index) =>{console.log('item',item); return (
      
    <tr key={index}>
      <td className="p-2 border">{'Placeholder'}</td>
      <td className="p-2 border"> <br/> Text: {item[0].text} <br/> Codes:{item[0].codes.join('::')}</td>
      <td className="p-2 border"> <br/> Text: {item[1] && item[1].text} <br/> Codes:{item[1]&&item[1].codes.join('::')}</td>
      <td className="p-2 border">{item[0].codes.join('::')}</td>
    </tr>)})}
  </tbody>
</table>
</div>);
}
export default Table;

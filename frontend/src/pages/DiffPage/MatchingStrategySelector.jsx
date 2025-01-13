function MatchingStrategySelector({criterias, setMatchingCriteria}) {
    return (
        <div className="flex items-center gap-2 flex-col">
        <select className="  rounded-md p-1 mx-2" name="matchingCriteria"  onChange={(e) => setMatchingCriteria(e.target.value)}>
            <option value="">Select strategy</option>
                {criterias.map(criteria => (
                    <option 
                    key={criteria} 
                    value={criteria}
                    >
                    {criteria}
                    </option>
                ))}
        </select>
        </div>
    );
}
export default MatchingStrategySelector;
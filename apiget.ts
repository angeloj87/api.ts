import type { State } from '@vincjo/datatables/remote';

let allData: any[] = [];

export const reload2 = async (state: State) => {
	if (allData.length === 0) {
		const response = await fetch(`http://api/get`);
		allData = await response.json();
	}

	let filteredData = allData;

	// Apply search
	if (state.search) {
		filteredData = filteredData.filter(item => 
			Object.values(item).some(value => 
				value && typeof value === 'string' && value.toLowerCase().includes(state.search!.toLowerCase())
			)
		);
	}

	// Apply filters
	if (state.filters) {
		state.filters.forEach(({ filterBy, value }) => {
			filteredData = filteredData.filter(item => 
				value && typeof item[filterBy] === 'string' && item[filterBy].toLowerCase().includes(value.toLowerCase())
			);
		});
	}

	// Apply sorting
	if (state.sort) {
		filteredData.sort((a, b) => {
			const aValue = a[state.sort!.orderBy];
			const bValue = b[state.sort!.orderBy];
			if (aValue < bValue) return state.sort!.direction === 'asc' ? -1 : 1;
			if (aValue > bValue) return state.sort!.direction === 'asc' ? 1 : -1;
			return 0;
		});
	}

	// Apply pagination
	const start = (state.pageNumber - 1) * state.rowsPerPage;
	const end = start + state.rowsPerPage;
	const paginatedData = filteredData.slice(start, end);

	return paginatedData;
};

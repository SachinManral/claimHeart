const MIN_PAGE = 1;
const MIN_ZOOM = 50;
const MAX_ZOOM = 200;

export function clampZoom(value: number): number {
	if (Number.isNaN(value)) {
		return 100;
	}
	return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value)));
}

export function clampPage(value: number, totalPages?: number): number {
	if (Number.isNaN(value) || value < MIN_PAGE) {
		return MIN_PAGE;
	}

	if (!totalPages) {
		return Math.round(value);
	}

	return Math.min(Math.round(value), totalPages);
}

export function nextPage(currentPage: number, totalPages?: number): number {
	const next = currentPage + 1;
	return clampPage(next, totalPages);
}

export function prevPage(currentPage: number): number {
	return clampPage(currentPage - 1);
}

export function appendPdfParams(fileUrl: string, page: number, zoom: number): string {
	const pageValue = clampPage(page);
	const zoomValue = clampZoom(zoom);
	const hash = `page=${pageValue}&zoom=${zoomValue}`;

	if (fileUrl.includes("#")) {
		return `${fileUrl.split("#")[0]}#${hash}`;
	}

	return `${fileUrl}#${hash}`;
}

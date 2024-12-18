import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Artwork, fetchArtworks } from '../services/artworkApi';

const ArtworksTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [page, setPage] = useState<number>(1);
  const [customSelectCount, setCustomSelectCount] = useState<number>(0);
  const overlayRef = useRef<OverlayPanel>(null);

  const rowsPerPage = 12;

  
  const fetchAndSetArtworks = async (pageNumber: number) => {
    try {
      const data = await fetchArtworks(pageNumber);
      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  };

  
  const onPageChangePaginator = (event: PaginatorPageChangeEvent) => {
    const currentPage = event.page + 1;
    setPage(currentPage); 
  };

  
  const handleCustomSelection = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRecords);
    const rowsToSelect = customSelectCount;
    const selectedSet = new Set(selectedArtworks.map((art) => art.id));

    
    for (let i = startIndex; i < endIndex && rowsToSelect > selectedSet.size; i++) {
      selectedSet.add(artworks[i]?.id);
    }

    
    const updatedSelection = artworks.filter((art) => selectedSet.has(art.id));
    setSelectedArtworks(updatedSelection);
    overlayRef.current?.hide();
  };

 
  const loadSelectedArtworks = () => {
    const storedSelections = localStorage.getItem('selectedArtworks');
    if (storedSelections) {
      setSelectedArtworks(JSON.parse(storedSelections));
    }
  };

  
  const saveSelectedArtworks = (selectedRows: Artwork[]) => {
    localStorage.setItem('selectedArtworks', JSON.stringify(selectedRows));
  };

  
  useEffect(() => {
    saveSelectedArtworks(selectedArtworks);
  }, [selectedArtworks]);

  
  useEffect(() => {
    fetchAndSetArtworks(page);
    loadSelectedArtworks();
  }, [page]);

  return (
    <div className="card">
      <DataTable
        value={artworks}
        paginator={false}
        rows={rowsPerPage}
        first={(page - 1) * rowsPerPage}
        totalRecords={totalRecords}
        selection={selectedArtworks}
        onSelectionChange={(e) => setSelectedArtworks(e.value)}
        selectionMode="multiple"
        scrollable
        scrollHeight="400px"
      >
        <Column
          selectionMode="multiple"
          header={
            <div>
              <i
                className="pi pi-chevron-down"
                style={{ cursor: 'pointer' }}
                onClick={(e) => overlayRef.current?.toggle(e)}
              />
              <OverlayPanel ref={overlayRef}>
                <div style={{ padding: '10px' }}>
                  <InputNumber
                    value={customSelectCount}
                    onValueChange={(e) => setCustomSelectCount(e.value || 0)}
                    min={0}
                    max={totalRecords}
                    placeholder="Select Rows"
                  />
                  <br />
                  <Button
                    label="Submit"
                    onClick={handleCustomSelection}
                    className="p-button-sm"
                    style={{ margin: '10px 5px 0px 0px', padding: '5px' }}
                  />
                </div>
              </OverlayPanel>
            </div>
          }
        />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>

      <Paginator
        first={(page - 1) * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={onPageChangePaginator}
        leftContent={`Showing ${(page - 1) * rowsPerPage + 1} to ${Math.min(page * rowsPerPage, totalRecords)} of ${totalRecords}`}
      />
    </div>
  );
};

export default ArtworksTable;

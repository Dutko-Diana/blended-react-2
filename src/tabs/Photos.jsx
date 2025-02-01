import { useEffect, useState } from 'react';
import Form from '../components/Form/Form';
import Text from '../components/Text/Text';
import { getPhotos } from '../apiService/photos.js';
import PhotosGallery from '../components/PhotosGallery/PhotosGallery.jsx';
import Loader from '../components/Loader/Loader.jsx';
import Button from '../components/Button/Button.jsx';
import { ImageModal } from '../components/ImageModal/ImageModal.jsx';

const Photos = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [modalAlt, setModalAlt] = useState('');

  useEffect(() => {
    if (!query) {
      return;
    }
    const fetchPhotos = async () => {
      setIsLoading(true);
      try {
        const { photos, total_results, per_page } = await getPhotos(
          query,
          page
        );
        if (!photos.length) {
          return setIsEmpty(true);
        }
        setImages(prev => {
          return [...prev, ...photos];
        });
        setIsVisible(page < Math.ceil(total_results / per_page));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPhotos();
  }, [page, query]);

  const onHandleSubmit = value => {
    setQuery(value);
    setImages([]);
    setError(null);
    setPage(1);
    setIsEmpty(false);
    setIsVisible(false);
  };

  const onLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const openModal = (src, alt) => {
    setModalIsOpen(true);
    setModalSrc(src);
    setModalAlt(alt);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setModalSrc('');
    setModalAlt('');
  };

  return (
    <>
      <Form onSubmit={onHandleSubmit} />
      {images.length > 0 && (
        <PhotosGallery images={images} openModal={openModal} />
      )}
      {isVisible && (
        <Button onClick={onLoadMore} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load more'}
        </Button>
      )}
      {!images.length && !isEmpty && !error && (
        <Text textAlign="center">Let`s begin search 🔎</Text>
      )}
      {isLoading && <Loader />}
      {error && (
        <Text textAlign="center">❌ Something went wrong - {error}</Text>
      )}
      {isEmpty && (
        <Text textAlign="center">Sorry. There are no images ... 😭</Text>
      )}
      <ImageModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        src={modalSrc}
        alt={modalAlt}
      />
    </>
  );
};

export default Photos;

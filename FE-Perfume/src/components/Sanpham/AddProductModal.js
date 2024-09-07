import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCalendarAlt,
  faCirclePlus,
  faCircleXmark,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import ImageUploading from "react-images-uploading";

const CustomDateInput = ({ value, onClick }) => (
  <div className="customDateInput" onClick={onClick}>
    <div className="valueDate">{value}</div>
    <FontAwesomeIcon icon={faCalendarAlt} className="iconfaCalendarAlt" />
  </div>
);

const AddProductModal = ({
  showModal,
  formData,
  handleInputChange,
  handleCloseModal,
  collections,
  categories,
  handleDateChange,
  handleImageChange,
  handleOpenConfirmModal,
  loading,
  fetchCategories, 
}) => {
  const [startDate, setStartDate] = useState(
    formData.releaseDate ? new Date(formData.releaseDate) : new Date()
  );

  const [images, setImages] = useState([]);

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
    handleImageChange({ target: { files: imageList.map((img) => img.file) } });
  };

  if (!showModal) return null;

  const handleDateClick = (date) => {
    handleDateChange(date);
    setStartDate(date);
  };

  const defaultVariants =
    formData.variants.length === 0
      ? [{ contenance: "", price: "", inStock: 0, sold: 0 }]
      : formData.variants;

  const handleAddVariant = () => {
    handleInputChange({
      target: {
        name: "variants",
        value: [
          ...defaultVariants,
          { contenance: "", price: "", inStock: 0, sold: 0 },
        ],
      },
    });
  };

  const handleRemoveVariant = (index) => {
    const newVariants = [...defaultVariants];
    newVariants.splice(index, 1);
    handleInputChange({
      target: {
        name: "variants",
        value: newVariants,
      },
    });
  };

  const handleCollectionChange = (e) => {
    const selectedCollectionId = e.target.value;
    handleInputChange(e); 
    fetchCategories(selectedCollectionId); 
  };

  return (
    <div className="modalAddproduct">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="modalContentAddproduct">
        <div className="h2div">
          <h2 className="h2">Add Product</h2>
          <div className="divclassIcon">
            <div className="classIcon">
              <FontAwesomeIcon icon={faXmark} onClick={handleCloseModal} />
            </div>
          </div>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label htmlFor="collection">Collection</label>
            <select
              name="collectionName"
              value={formData.collectionName}
              onChange={handleCollectionChange}
              className="collection"
            >
              <option value="">Select Collection</option>
              {collections.map((collection) => (
                <option key={collection._id} value={collection.name}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              name="categoryName"
              value={formData.categoryName}
              onChange={handleInputChange}
              className="category"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="productName">Product</label>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleInputChange}
              className="productName"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={69}
              dataURLKey="data_url"
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                <div className="upload__image-wrapper">
                  <button
                    style={isDragging ? { color: "red" } : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    Click or Drop here
                  </button>
                  &nbsp;
                  <button onClick={onImageRemoveAll}>Remove all images</button>
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <img src={image.data_url} alt="" width="100" />
                      <div className="image-item__btn-wrapper">
                        <button onClick={() => onImageUpdate(index)}>
                          Update
                        </button>
                        <button onClick={() => onImageRemove(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ImageUploading>
          </div>

          <div className="form-group">
            <label htmlFor="releaseDate">Release Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => handleDateClick(date)}
              dateFormat="yyyy/MM/dd"
              customInput={<CustomDateInput />}
            />
          </div>

          <div className="form-group">
            <label htmlFor="releaseDate">Variants</label>
          </div>

          {defaultVariants.map((variant, index) => (
            <div key={index}>
              <div className="variantsGroup">
                <div className="form-group">
                  <label htmlFor="contenance">Contenance</label>
                  <input
                    type="text"
                    name="contenance"
                    placeholder="Contenance"
                    value={variant.contenance}
                    onChange={(e) => handleInputChange(e, index, "contenance")}
                    className="contenance"
                  />
                </div>

                <div className="form-group1">
                  <label htmlFor="price">Price</label>
                  <input
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) => handleInputChange(e, index, "price")}
                    className="price"
                  />
                </div>

                <div className="form-group2">
                  <label htmlFor="inStock">In Stock</label>
                  <input
                    type="text"
                    name="inStock"
                    placeholder="In Stock"
                    value={variant.inStock}
                    onChange={(e) => handleInputChange(e, index, "inStock")}
                    className="instock"
                  />
                </div>
              </div>

              <button
                type="button"
                className="remove-variant-button"
                onClick={() => handleRemoveVariant(index)}
              >
                <FontAwesomeIcon icon={faTrashAlt} /> Remove Variant
              </button>
            </div>
          ))}

          <button
            type="button"
            className="add-variant-button"
            onClick={handleAddVariant}
          >
            <FontAwesomeIcon icon={faCirclePlus} /> Add Variant
          </button>

          <div className="form-group">
            <label htmlFor="descriptionBody">Description</label>
            <textarea
              name="descriptionBody"
              placeholder="Description"
              value={formData.descriptionBody}
              onChange={handleInputChange}
              className="description"
            />
          </div>

          <div className="form-buttons">
            <button onClick={handleOpenConfirmModal} className="classbuttonAdd">
              <FontAwesomeIcon icon={faCirclePlus} className="iconAdd" />
              <p className="textAdd">Add</p>
            </button>
            <button onClick={handleCloseModal} className="classbuttonCancel">
              <FontAwesomeIcon icon={faCircleXmark} className="iconCancel" />
              <p className="textCancel">Cancel</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;


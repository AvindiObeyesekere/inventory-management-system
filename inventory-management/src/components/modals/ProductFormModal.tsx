import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import type { StoredCategory, StoredProduct } from '@/utils/localStorage';

type ProductFormValues = {
  productName: string;
  category: string;
  metricValue: string;
  price: string;
  stockQuantity: string;
};

const initialValues: ProductFormValues = {
  productName: '',
  category: '',
  metricValue: '',
  price: '',
  stockQuantity: '',
};

const productSchema = Yup.object({
  productName: Yup.string().trim().required('Product name is required'),
  category: Yup.string().trim().required('Category is required'),
  metricValue: Yup.string().trim().required('Metric value is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .min(0, 'Price cannot be negative')
    .required('Price is required'),
  stockQuantity: Yup.number()
    .typeError('Stock quantity must be a number')
    .integer('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative'),
});

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: StoredProduct | null;
  categories: StoredCategory[];
  onSave: (values: ProductFormValues) => void;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  editingProduct,
  categories,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  const formInitialValues: ProductFormValues = editingProduct
    ? {
        productName: editingProduct.productName,
        category: editingProduct.category,
        metricValue: editingProduct.metricValue ?? '',
        price: String(editingProduct.price),
        stockQuantity: String(editingProduct.stockQuantity),
      }
    : initialValues;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 px-4">
      <div className="w-full max-w-2xl app-card shadow-xl">
        <div className="flex items-center justify-between border-b app-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold app-heading">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </h2>
            {editingProduct && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {editingProduct.productId} / {editingProduct.sku}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Formik
          initialValues={formInitialValues}
          enableReinitialize
          validationSchema={productSchema}
          onSubmit={onSave}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5 px-6 py-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ['productName', 'Product Name', 'text'],
                  ['metricValue', 'Metric Value', 'text'],
                  ['price', 'Price', 'number'],
                  ['stockQuantity', 'Initial Stock Quantity', 'number'],
                ].map(([name, label, type]) => (
                  <div key={name} className={name === 'stockQuantity' ? 'sm:col-span-2' : ''}>
                    <label htmlFor={name} className="block text-sm font-medium app-label">
                      {label}
                    </label>
                    <Field
                      id={name}
                      name={name}
                      type={type}
                      className="mt-1 block w-full app-field"
                    />
                    <ErrorMessage name={name} component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                ))}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium app-label">
                    Category
                  </label>
                  <Field
                    id="category"
                    name="category"
                    type="text"
                    list="product-category-options"
                    placeholder="Search or select category"
                    className="mt-1 block w-full app-field"
                  />
                  <datalist id="product-category-options">
                    {categories.map((category) => (
                      <option key={category.id} value={category.name} />
                    ))}
                  </datalist>
                  <ErrorMessage name="category" component="p" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t app-border pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold app-label transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
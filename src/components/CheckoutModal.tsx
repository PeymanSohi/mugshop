import React, { useEffect, useMemo, useState } from 'react';
import { X, Lock, CreditCard, Truck, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { CartState, Address, Order, Product } from '../types';
import { useUser } from '../context/UserContext';
import { formatPersianPrice, toPersianNumbers } from '../utils/persianNumbers';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartState;
}

type Step = 'address' | 'shipping' | 'payment' | 'review' | 'success';

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 15;

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cart }) => {
  const { user, isAuthenticated, addAddress, createOrder } = useUser();
  const [activeStep, setActiveStep] = useState<Step>('address');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    type: 'home',
    title: 'خانه',
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  });
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveStep('address');
      setOrderId(null);
      setIsSubmitting(false);
      // Preselect default address if exists
      const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];
      setSelectedAddressId(defaultAddress?.id || null);
      setNewAddress(prev => ({
        ...prev,
        fullName: user?.name || '',
        phone: user?.phone || ''
      }));
    }
  }, [isOpen, user]);

  const shippingCost = useMemo(() => {
    if (cart.total >= FREE_SHIPPING_THRESHOLD) return 0;
    return shippingMethod === 'standard' ? SHIPPING_COST : SHIPPING_COST * 2;
  }, [cart.total, shippingMethod]);

  const totalPayable = cart.total + shippingCost;

  if (!isOpen) return null;

  const handleAddAddress = () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.province || !newAddress.postalCode) return;
    addAddress(newAddress);
  };

  const handleNext = () => {
    if (activeStep === 'address') setActiveStep('shipping');
    else if (activeStep === 'shipping') setActiveStep('payment');
    else if (activeStep === 'payment') setActiveStep('review');
  };

  const handleBack = () => {
    if (activeStep === 'shipping') setActiveStep('address');
    else if (activeStep === 'payment') setActiveStep('shipping');
    else if (activeStep === 'review') setActiveStep('payment');
  };

  const handleSubmitOrder = async () => {
    if (!user || !isAuthenticated) return;
    const selectedAddress = user.addresses?.find(a => a.id === selectedAddressId) || null;
    if (!selectedAddress) return;

    setIsSubmitting(true);
    await new Promise(res => setTimeout(res, 800));

    createOrder({
      items: cart.items.map(i => ({ product: i.product, quantity: i.quantity })),
      total: totalPayable,
      status: 'processing',
      shippingAddress: selectedAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      trackingNumber: undefined
    } as Omit<Order, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);

    setOrderId(`order_${Date.now()}`);
    setIsSubmitting(false);
    setActiveStep('success');
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span>تکمیل فرایند خرید</span>
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="بستن">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Steps */}
          <div className="px-4 sm:px-6 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className={`flex items-center gap-2 ${activeStep === 'address' ? 'text-primary-600' : 'text-gray-500'}`}>
                <UserIcon className="h-4 w-4" />
                <span>آدرس</span>
              </div>
              <div className={`flex items-center gap-2 ${activeStep === 'shipping' ? 'text-primary-600' : 'text-gray-500'}`}>
                <Truck className="h-4 w-4" />
                <span>ارسال</span>
              </div>
              <div className={`flex items-center gap-2 ${activeStep === 'payment' ? 'text-primary-600' : 'text-gray-500'}`}>
                <CreditCard className="h-4 w-4" />
                <span>پرداخت</span>
              </div>
              <div className={`flex items-center gap-2 ${activeStep === 'review' ? 'text-primary-600' : 'text-gray-500'}`}>
                <CheckCircle2 className="h-4 w-4" />
                <span>بازبینی</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Content */}
            <div className="lg:col-span-2 p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[65vh] overflow-y-auto">
              {activeStep === 'address' && (
                <div className="space-y-4">
                  <h4 className="font-semibold">انتخاب آدرس</h4>
                  {user?.addresses && user.addresses.length > 0 ? (
                    <div className="space-y-3">
                      {user.addresses.map(addr => (
                        <label key={addr.id} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                          <input
                            type="radio"
                            name="address"
                            className="mt-1"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                          />
                          <div className="text-sm">
                            <div className="font-medium">{addr.title} • {addr.fullName}</div>
                            <div className="text-gray-600 dark:text-gray-300">{addr.address}, {addr.city}, {addr.province}</div>
                            <div className="text-gray-500 text-xs">{addr.phone} • {addr.postalCode}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">آدرسی موجود نیست. لطفاً آدرس جدید اضافه کنید.</p>
                  )}

                  <div className="border-t pt-4">
                    <h5 className="font-medium mb-3">افزودن آدرس جدید</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input className="border rounded-lg px-3 py-2 text-sm" placeholder="نام و نام خانوادگی" value={newAddress.fullName} onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })} />
                      <input className="border rounded-lg px-3 py-2 text-sm" placeholder="شماره تماس" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} dir="ltr" />
                      <input className="border rounded-lg px-3 py-2 text-sm" placeholder="شهر" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                      <input className="border rounded-lg px-3 py-2 text-sm" placeholder="استان" value={newAddress.province} onChange={e => setNewAddress({ ...newAddress, province: e.target.value })} />
                      <input className="border rounded-lg px-3 py-2 text-sm sm:col-span-2" placeholder="آدرس کامل" value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} />
                      <input className="border rounded-lg px-3 py-2 text-sm" placeholder="کد پستی" value={newAddress.postalCode} onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })} dir="ltr" />
                    </div>
                    <div className="mt-3">
                      <button onClick={handleAddAddress} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm">ثبت آدرس</button>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 'shipping' && (
                <div className="space-y-4">
                  <h4 className="font-semibold">روش ارسال</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                        <div>
                          <div className="font-medium">استاندارد</div>
                          <div className="text-xs text-gray-500">۳-۵ روز کاری</div>
                        </div>
                      </div>
                      <div className="font-semibold">{cart.total >= FREE_SHIPPING_THRESHOLD ? 'رایگان' : formatPersianPrice(SHIPPING_COST)}</div>
                    </label>
                    <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                        <div>
                          <div className="font-medium">سریع</div>
                          <div className="text-xs text-gray-500">۱-۲ روز کاری</div>
                        </div>
                      </div>
                      <div className="font-semibold">{formatPersianPrice(SHIPPING_COST * 2)}</div>
                    </label>
                  </div>
                </div>
              )}

              {activeStep === 'payment' && (
                <div className="space-y-4">
                  <h4 className="font-semibold">روش پرداخت</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                        <div>
                          <div className="font-medium">پرداخت آنلاین</div>
                          <div className="text-xs text-gray-500">درگاه امن بانکی</div>
                        </div>
                      </div>
                      <CreditCard className="h-5 w-5" />
                    </label>
                    <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                        <div>
                          <div className="font-medium">پرداخت در محل</div>
                          <div className="text-xs text-gray-500">تهران و شهرهای منتخب</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {activeStep === 'review' && (
                <div className="space-y-4">
                  <h4 className="font-semibold">بازبینی سفارش</h4>
                  <div className="space-y-3">
                    {cart.items.map(i => (
                      <div key={i.product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <img src={i.product.image} alt={i.product.name} className="w-12 h-12 rounded object-cover" />
                          <div>
                            <div className="font-medium text-sm">{i.product.name}</div>
                            <div className="text-xs text-gray-500">تعداد: {toPersianNumbers(i.quantity.toString())}</div>
                          </div>
                        </div>
                        <div className="font-semibold text-sm">{formatPersianPrice((i.product.salePrice || i.product.price) * i.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeStep === 'success' && (
                <div className="text-center py-10">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">سفارش با موفقیت ثبت شد</h4>
                  {orderId && <p className="text-gray-600">شماره سفارش: {orderId}</p>}
                  <button onClick={onClose} className="mt-6 px-5 py-2 bg-primary-600 text-white rounded-lg">بستن</button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="lg:border-r border-gray-100 dark:border-gray-700 p-4 sm:p-6 space-y-4">
              <h4 className="font-semibold">خلاصه سفارش</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>جمع کل</span>
                  <span>{formatPersianPrice(cart.total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>هزینه ارسال</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : ''}>{shippingCost === 0 ? 'رایگان' : formatPersianPrice(shippingCost)}</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between font-semibold">
                  <span>مبلغ قابل پرداخت</span>
                  <span className="text-primary-600">{formatPersianPrice(totalPayable)}</span>
                </div>
              </div>

              {activeStep !== 'success' && (
                <div className="space-y-2">
                  <button
                    onClick={activeStep === 'review' ? handleSubmitOrder : handleNext}
                    className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium disabled:opacity-60"
                    disabled={
                      (activeStep === 'address' && !selectedAddressId && (!newAddress.fullName || !newAddress.address)) ||
                      isSubmitting
                    }
                  >
                    {activeStep === 'review' ? (isSubmitting ? 'در حال ثبت...' : 'ثبت سفارش') : 'ادامه'}
                  </button>
                  {activeStep !== 'address' && (
                    <button onClick={handleBack} className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2.5 rounded-lg font-medium">بازگشت</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;



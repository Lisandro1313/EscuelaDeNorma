import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Obtener parámetros de la URL de MercadoPago
    const collection_id = searchParams.get('collection_id');
    const collection_status = searchParams.get('collection_status');
    const payment_id = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const external_reference = searchParams.get('external_reference');
    const payment_type = searchParams.get('payment_type');
    const merchant_order_id = searchParams.get('merchant_order_id');
    const preference_id = searchParams.get('preference_id');
    const site_id = searchParams.get('site_id');
    const processing_mode = searchParams.get('processing_mode');
    const merchant_account_id = searchParams.get('merchant_account_id');

    setPaymentData({
      collection_id,
      collection_status,
      payment_id,
      status,
      external_reference,
      payment_type,
      merchant_order_id,
      preference_id,
      site_id,
      processing_mode,
      merchant_account_id
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">¡Pago Exitoso!</h1>
        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. Ya tienes acceso al curso.
        </p>

        {paymentData?.payment_id && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-2">Detalles del Pago</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>ID de Pago: {paymentData.payment_id}</div>
              <div>Estado: {paymentData.status}</div>
              {paymentData.external_reference && (
                <div>Referencia: {paymentData.external_reference}</div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Ir a Mi Dashboard
          </button>
          <button
            onClick={() => navigate('/courses')}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Ver Más Cursos
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Recibirás un email de confirmación en breve.</p>
          <p>Si tienes alguna duda, contacta a soporte.</p>
        </div>
      </div>
    </div>
  );
};

export const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getErrorMessage = () => {
    const status = searchParams.get('status');
    const status_detail = searchParams.get('status_detail');
    
    switch (status_detail) {
      case 'cc_rejected_insufficient_amount':
        return 'Fondos insuficientes en la tarjeta';
      case 'cc_rejected_bad_filled_card_number':
        return 'Número de tarjeta incorrecto';
      case 'cc_rejected_bad_filled_date':
        return 'Fecha de vencimiento incorrecta';
      case 'cc_rejected_bad_filled_security_code':
        return 'Código de seguridad incorrecto';
      case 'cc_rejected_call_for_authorize':
        return 'Debes autorizar el pago con tu banco';
      default:
        return 'El pago no pudo ser procesado';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Pago Fallido</h1>
        <p className="text-gray-600 mb-2">
          {getErrorMessage()}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Puedes intentar nuevamente con otro método de pago.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Intentar Nuevamente
          </button>
          <button
            onClick={() => navigate('/courses')}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Volver a Cursos
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Si el problema persiste, contacta a soporte.</p>
        </div>
      </div>
    </div>
  );
};

export const PaymentPending: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-yellow-600 mb-2">Pago Pendiente</h1>
        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Te notificaremos cuando se complete.
        </p>

        {searchParams.get('payment_id') && (
          <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-2">Información del Pago</h3>
            <div className="text-sm text-gray-600">
              <div>ID de Pago: {searchParams.get('payment_id')}</div>
              <div>Estado: Pendiente de aprobación</div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            Ir a Mi Dashboard
          </button>
          <button
            onClick={() => navigate('/courses')}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Ver Más Cursos
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Los pagos pueden tardar hasta 48 horas en procesarse.</p>
          <p>Recibirás una notificación cuando se complete.</p>
        </div>
      </div>
    </div>
  );
};
import apiService from './api';

export interface PaymentPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  external_reference: string;
}

export interface PaymentConfig {
  configured: boolean;
  demo: boolean;
  message: string;
  publicKey?: string;
}

export interface PaymentStatus {
  id: string;
  status: string;
  status_detail: string;
  transaction_amount: number;
  external_reference: string;
  payment_method_id: string;
  payment_type_id: string;
  date_created: string;
  date_approved?: string;
}

class PaymentService {
  // Obtener configuración de MercadoPago
  async getPaymentConfig(): Promise<PaymentConfig> {
    const response = await apiService.get('/payments/config');
    return response.data;
  }

  // Crear preferencia de pago para un curso
  async createCoursePayment(courseId: number): Promise<{
    demo: boolean;
    preference?: PaymentPreference;
    mockPayment?: any;
    course: any;
    message?: string;
  }> {
    const response = await apiService.post('/payments/create-preference', {
      courseId
    });
    return response.data;
  }

  // Verificar estado de un pago
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus | { demo: boolean; status: string; message: string }> {
    const response = await apiService.get(`/payments/${paymentId}/status`);
    return response.data;
  }

  // Procesar pago en modo demo
  async processDemoPayment(): Promise<{
    success: boolean;
    message: string;
    paymentId: string;
  }> {
    // Simular delay del procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular éxito/fallo aleatorio (90% éxito)
    const success = Math.random() > 0.1;
    
    return {
      success,
      message: success ? 'Pago procesado exitosamente (DEMO)' : 'Error en el pago (DEMO)',
      paymentId: `demo_${Date.now()}`
    };
  }

  // Redirigir a MercadoPago
  redirectToMercadoPago(initPoint: string): void {
    if (initPoint === '#') {
      // Modo demo - mostrar mensaje
      alert('Modo demostración: En producción serías redirigido a MercadoPago');
      return;
    }
    
    // Redirigir a MercadoPago en producción
    window.location.href = initPoint;
  }

  // Obtener reporte de pagos (solo para administradores)
  async getPaymentReport(startDate?: string, endDate?: string): Promise<{
    total_payments: number;
    total_amount: number;
    successful_payments: number;
    failed_payments: number;
    currency: string;
    period: { from: string; to: string };
  }> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiService.get(`/payments/report?${params.toString()}`);
    return response.data;
  }

  // Formatear cantidad de dinero
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Formatear estado de pago para mostrar al usuario
  formatPaymentStatus(status: string): { text: string; color: string; icon: string } {
    const statusMap: Record<string, { text: string; color: string; icon: string }> = {
      'pending': { text: 'Pendiente', color: 'yellow', icon: '⏳' },
      'approved': { text: 'Aprobado', color: 'green', icon: '✅' },
      'authorized': { text: 'Autorizado', color: 'blue', icon: '🔐' },
      'in_process': { text: 'En Proceso', color: 'blue', icon: '🔄' },
      'in_mediation': { text: 'En Mediación', color: 'orange', icon: '⚖️' },
      'rejected': { text: 'Rechazado', color: 'red', icon: '❌' },
      'cancelled': { text: 'Cancelado', color: 'gray', icon: '🚫' },
      'refunded': { text: 'Reembolsado', color: 'purple', icon: '↩️' },
      'charged_back': { text: 'Contracargo', color: 'red', icon: '⚠️' }
    };

    return statusMap[status] || { text: 'Desconocido', color: 'gray', icon: '❓' };
  }

  // Validar tarjeta de crédito (básico)
  validateCreditCard(cardNumber: string): { valid: boolean; type?: string } {
    // Remover espacios y guiones
    const cleanNumber = cardNumber.replace(/[\s-]/g, '');
    
    // Verificar que solo contenga números
    if (!/^\d+$/.test(cleanNumber)) {
      return { valid: false };
    }

    // Algoritmo de Luhn para validar
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }

    const valid = sum % 10 === 0;

    // Detectar tipo de tarjeta
    let type = 'unknown';
    if (cleanNumber.startsWith('4')) type = 'visa';
    else if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) type = 'mastercard';
    else if (cleanNumber.startsWith('3')) type = 'amex';

    return { valid, type };
  }

  // Generar link de pago compartible
  generatePaymentLink(courseId: number, courseName: string): string {
    const encodedName = encodeURIComponent(courseName);
    return `${window.location.origin}/course/${courseId}/payment?ref=${encodedName}`;
  }
}

export const paymentService = new PaymentService();
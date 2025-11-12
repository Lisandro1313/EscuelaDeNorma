const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

class MercadoPagoService {
  constructor() {
    // Configurar MercadoPago con las credenciales del entorno
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-ACCESS-TOKEN-AQUI',
      options: {
        timeout: 5000,
        idempotencyKey: 'abc'
      }
    });

    this.preference = new Preference(this.client);
    this.payment = new Payment(this.client);
  }

  // Crear preferencia de pago para un curso
  async createCoursePayment(courseData, userData) {
    try {
      const preferenceData = {
        items: [
          {
            id: courseData.id.toString(),
            title: courseData.nombre,
            description: courseData.descripcion,
            picture_url: courseData.imagen || 'https://example.com/course-image.jpg',
            category_id: 'education',
            quantity: 1,
            currency_id: 'USD',
            unit_price: parseFloat(courseData.precio)
          }
        ],
        payer: {
          name: userData.nombre,
          surname: userData.apellido || '',
          email: userData.email,
          phone: {
            area_code: '',
            number: userData.telefono || ''
          }
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12 // Máximo 12 cuotas
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/payment/success`,
          failure: `${process.env.FRONTEND_URL}/payment/failure`,
          pending: `${process.env.FRONTEND_URL}/payment/pending`
        },
        auto_return: 'approved',
        external_reference: `course_${courseData.id}_user_${userData.id}_${Date.now()}`,
        notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
        statement_descriptor: 'CAMPUS NORMA',
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
      };

      const preference = await this.preference.create({ body: preferenceData });
      
      return {
        id: preference.id,
        init_point: preference.init_point,
        sandbox_init_point: preference.sandbox_init_point,
        external_reference: preferenceData.external_reference
      };

    } catch (error) {
      console.error('Error creando preferencia de MercadoPago:', error);
      throw new Error('Error al procesar el pago');
    }
  }

  // Verificar estado de un pago
  async getPaymentStatus(paymentId) {
    try {
      const payment = await this.payment.get({ id: paymentId });
      
      return {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        transaction_amount: payment.transaction_amount,
        external_reference: payment.external_reference,
        payment_method_id: payment.payment_method_id,
        payment_type_id: payment.payment_type_id,
        date_created: payment.date_created,
        date_approved: payment.date_approved
      };

    } catch (error) {
      console.error('Error obteniendo estado del pago:', error);
      throw new Error('Error al verificar el pago');
    }
  }

  // Procesar notificación de webhook
  async processWebhookNotification(notification) {
    try {
      if (notification.type === 'payment') {
        const paymentData = await this.getPaymentStatus(notification.data.id);
        
        // Extraer información del external_reference
        const externalRef = paymentData.external_reference;
        const refParts = externalRef.split('_');
        
        if (refParts.length >= 4) {
          const courseId = parseInt(refParts[1]);
          const userId = parseInt(refParts[3]);
          
          return {
            courseId,
            userId,
            paymentData,
            success: paymentData.status === 'approved'
          };
        }
      }
      
      return null;

    } catch (error) {
      console.error('Error procesando webhook:', error);
      throw new Error('Error al procesar notificación');
    }
  }

  // Crear suscripción mensual (opcional para cursos premium)
  async createSubscription(courseData, userData) {
    try {
      const preferenceData = {
        items: [
          {
            id: `subscription_${courseData.id}`,
            title: `Suscripción Premium - ${courseData.nombre}`,
            description: `Acceso completo al curso ${courseData.nombre} por 30 días`,
            quantity: 1,
            currency_id: 'USD',
            unit_price: parseFloat(courseData.precio) * 0.3 // 30% del precio total por mes
          }
        ],
        payer: {
          name: userData.nombre,
          email: userData.email
        },
        payment_methods: {
          excluded_payment_types: [
            { id: 'ticket' },
            { id: 'atm' }
          ]
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/subscription/success`,
          failure: `${process.env.FRONTEND_URL}/subscription/failure`,
          pending: `${process.env.FRONTEND_URL}/subscription/pending`
        },
        auto_return: 'approved',
        external_reference: `subscription_${courseData.id}_user_${userData.id}_${Date.now()}`
      };

      const preference = await this.preference.create({ body: preferenceData });
      
      return {
        id: preference.id,
        init_point: preference.init_point,
        sandbox_init_point: preference.sandbox_init_point,
        type: 'subscription'
      };

    } catch (error) {
      console.error('Error creando suscripción:', error);
      throw new Error('Error al crear suscripción');
    }
  }

  // Generar reporte de pagos
  async getPaymentReport(startDate, endDate) {
    try {
      // En un caso real, aquí consultarías la API de MercadoPago para obtener todos los pagos
      // Por ahora, retornamos datos simulados
      return {
        total_payments: 45,
        total_amount: 1250.00,
        successful_payments: 42,
        failed_payments: 3,
        currency: 'USD',
        period: {
          from: startDate,
          to: endDate
        }
      };

    } catch (error) {
      console.error('Error generando reporte:', error);
      throw new Error('Error al generar reporte');
    }
  }

  // Validar configuración de MercadoPago
  validateConfiguration() {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY;

    if (!accessToken || accessToken === 'your_mercadopago_access_token') {
      return {
        valid: false,
        message: 'ACCESS_TOKEN de MercadoPago no configurado',
        demo: true
      };
    }

    if (!publicKey || publicKey === 'your_mercadopago_public_key') {
      return {
        valid: false,
        message: 'PUBLIC_KEY de MercadoPago no configurado',
        demo: true
      };
    }

    return {
      valid: true,
      message: 'MercadoPago configurado correctamente',
      demo: false
    };
  }
}

module.exports = MercadoPagoService;
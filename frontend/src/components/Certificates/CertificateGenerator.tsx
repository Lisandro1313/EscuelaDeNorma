import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

interface CertificateData {
  id: string;
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: Date;
  grade: number;
  courseHours: number;
  certificateNumber: string;
  institutionName: string;
  institutionLogo?: string;
  template: 'modern' | 'classic' | 'elegant' | 'minimalist';
}

interface CertificateTemplate {
  id: string;
  name: string;
  preview: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

interface CertificateGeneratorProps {
  onCertificateGenerated?: (certificate: CertificateData) => void;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  onCertificateGenerated
}) => {
  const { usuario } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [certificateData, setCertificateData] = useState<Partial<CertificateData>>({
    studentName: usuario?.nombre || '',
    courseName: 'Curso de Desarrollo Web Frontend',
    instructorName: 'Dr. María García',
    completionDate: new Date(),
    grade: 95,
    courseHours: 40,
    certificateNumber: `CERT-${Date.now()}`,
    institutionName: 'Campus Virtual Norma',
    template: 'modern'
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState<string | null>(null);

  const templates: CertificateTemplate[] = [
    {
      id: 'modern',
      name: 'Moderno',
      preview: '🎨',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      fontFamily: 'Arial, sans-serif'
    },
    {
      id: 'classic',
      name: 'Clásico',
      preview: '📜',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      fontFamily: 'Times New Roman, serif'
    },
    {
      id: 'elegant',
      name: 'Elegante',
      preview: '✨',
      primaryColor: '#7C3AED',
      secondaryColor: '#5B21B6',
      fontFamily: 'Georgia, serif'
    },
    {
      id: 'minimalist',
      name: 'Minimalista',
      preview: '⭕',
      primaryColor: '#374151',
      secondaryColor: '#111827',
      fontFamily: 'Helvetica, sans-serif'
    }
  ];

  const generateCertificate = async () => {
    setIsGenerating(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Configurar canvas
      canvas.width = 1200;
      canvas.height = 800;

      const template = templates.find(t => t.id === selectedTemplate) || templates[0];

      // Limpiar canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar borde
      ctx.strokeStyle = template.primaryColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      // Borde interno decorativo
      ctx.strokeStyle = template.secondaryColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

      // Título "CERTIFICADO"
      ctx.fillStyle = template.primaryColor;
      ctx.font = `bold 48px ${template.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('CERTIFICADO DE FINALIZACIÓN', canvas.width / 2, 150);

      // Línea decorativa bajo el título
      ctx.beginPath();
      ctx.moveTo(300, 170);
      ctx.lineTo(900, 170);
      ctx.strokeStyle = template.secondaryColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Texto "Se certifica que"
      ctx.fillStyle = '#374151';
      ctx.font = `24px ${template.fontFamily}`;
      ctx.fillText('Se certifica que', canvas.width / 2, 220);

      // Nombre del estudiante
      ctx.fillStyle = template.primaryColor;
      ctx.font = `bold 36px ${template.fontFamily}`;
      ctx.fillText(certificateData.studentName || 'Nombre del Estudiante', canvas.width / 2, 280);

      // Línea bajo el nombre
      ctx.beginPath();
      ctx.moveTo(350, 295);
      ctx.lineTo(850, 295);
      ctx.strokeStyle = template.primaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Texto descriptivo
      ctx.fillStyle = '#374151';
      ctx.font = `20px ${template.fontFamily}`;
      ctx.fillText('ha completado satisfactoriamente el curso', canvas.width / 2, 340);

      // Nombre del curso
      ctx.fillStyle = template.secondaryColor;
      ctx.font = `bold 28px ${template.fontFamily}`;
      ctx.fillText(certificateData.courseName || 'Nombre del Curso', canvas.width / 2, 380);

      // Información adicional
      ctx.fillStyle = '#374151';
      ctx.font = `18px ${template.fontFamily}`;
      ctx.fillText(
        `con una calificación de ${certificateData.grade}% y ${certificateData.courseHours} horas académicas`,
        canvas.width / 2,
        420
      );

      // Fecha de finalización
      const formattedDate = certificateData.completionDate?.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      ctx.fillText(`Completado el ${formattedDate}`, canvas.width / 2, 460);

      // Instructor
      ctx.fillStyle = template.primaryColor;
      ctx.font = `bold 20px ${template.fontFamily}`;
      ctx.textAlign = 'left';
      ctx.fillText('Instructor:', 200, 550);
      ctx.fillStyle = '#374151';
      ctx.font = `18px ${template.fontFamily}`;
      ctx.fillText(certificateData.instructorName || 'Instructor', 200, 580);

      // Línea de firma del instructor
      ctx.beginPath();
      ctx.moveTo(200, 600);
      ctx.lineTo(400, 600);
      ctx.strokeStyle = '#9CA3AF';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Institución
      ctx.fillStyle = template.primaryColor;
      ctx.font = `bold 20px ${template.fontFamily}`;
      ctx.textAlign = 'right';
      ctx.fillText('Institución:', canvas.width - 200, 550);
      ctx.fillStyle = '#374151';
      ctx.font = `18px ${template.fontFamily}`;
      ctx.fillText(certificateData.institutionName || 'Institución', canvas.width - 200, 580);

      // Línea de firma de la institución
      ctx.beginPath();
      ctx.moveTo(canvas.width - 400, 600);
      ctx.lineTo(canvas.width - 200, 600);
      ctx.strokeStyle = '#9CA3AF';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Número de certificado
      ctx.fillStyle = '#6B7280';
      ctx.font = `12px ${template.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(
        `Certificado No. ${certificateData.certificateNumber}`,
        canvas.width / 2,
        canvas.height - 100
      );

      // Fecha de emisión
      ctx.fillText(
        `Emitido el ${new Date().toLocaleDateString('es-ES')}`,
        canvas.width / 2,
        canvas.height - 80
      );

      // Decoraciones adicionales según la plantilla
      if (selectedTemplate === 'elegant') {
        // Agregar elementos decorativos para la plantilla elegante
        drawDecorative(ctx, template);
      }

      // Convertir a imagen
      const imageData = canvas.toDataURL('image/png');
      setGeneratedCertificate(imageData);

      if (onCertificateGenerated) {
        const certificate: CertificateData = {
          ...certificateData as CertificateData,
          id: `CERT-${Date.now()}`
        };
        onCertificateGenerated(certificate);
      }

    } catch (error) {
      console.error('Error generando certificado:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const drawDecorative = (ctx: CanvasRenderingContext2D, template: CertificateTemplate) => {
    // Decoraciones en las esquinas
    ctx.fillStyle = template.primaryColor;
    
    // Esquina superior izquierda
    ctx.beginPath();
    ctx.arc(100, 100, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Esquina superior derecha
    ctx.beginPath();
    ctx.arc(1100, 100, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Esquina inferior izquierda
    ctx.beginPath();
    ctx.arc(100, 700, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Esquina inferior derecha
    ctx.beginPath();
    ctx.arc(1100, 700, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  const downloadCertificate = () => {
    if (!generatedCertificate) return;

    const link = document.createElement('a');
    link.download = `certificado-${certificateData.studentName?.replace(/\s+/g, '-').toLowerCase()}-${certificateData.certificateNumber}.png`;
    link.href = generatedCertificate;
    link.click();
  };

  const generatePDF = async () => {
    if (!generatedCertificate) return;

    // Simular generación de PDF
    // En una implementación real, usarías jsPDF o similar
    const link = document.createElement('a');
    link.download = `certificado-${certificateData.studentName?.replace(/\s+/g, '-').toLowerCase()}-${certificateData.certificateNumber}.pdf`;
    link.href = generatedCertificate; // En realidad sería el PDF generado
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Generador de Certificados 🏆</h1>
            <p className="text-gray-600 mt-2">
              Crea certificados personalizados para tus estudiantes
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={generateCertificate}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              {isGenerating ? '⏳ Generando...' : '🔨 Generar Certificado'}
            </button>
            
            {generatedCertificate && (
              <>
                <button
                  onClick={downloadCertificate}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  📥 Descargar PNG
                </button>
                
                <button
                  onClick={generatePDF}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  📄 Descargar PDF
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de configuración */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Datos del Certificado</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Estudiante
                  </label>
                  <input
                    type="text"
                    value={certificateData.studentName || ''}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, studentName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre completo del estudiante"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Curso
                  </label>
                  <input
                    type="text"
                    value={certificateData.courseName || ''}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, courseName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del curso completado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={certificateData.instructorName || ''}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, instructorName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del instructor"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calificación (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={certificateData.grade || 0}
                      onChange={(e) => setCertificateData(prev => ({ ...prev, grade: parseInt(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horas del Curso
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={certificateData.courseHours || 0}
                      onChange={(e) => setCertificateData(prev => ({ ...prev, courseHours: parseInt(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Finalización
                  </label>
                  <input
                    type="date"
                    value={certificateData.completionDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, completionDate: new Date(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institución
                  </label>
                  <input
                    type="text"
                    value={certificateData.institutionName || ''}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, institutionName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre de la institución"
                  />
                </div>
              </div>
            </div>

            {/* Selección de plantilla */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Plantillas Disponibles</h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setCertificateData(prev => ({ ...prev, template: template.id as any }));
                    }}
                    className={`p-4 rounded-lg border-2 transition duration-200 ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{template.preview}</div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <div className="flex justify-center space-x-1 mt-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: template.primaryColor }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: template.secondaryColor }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Información del certificado */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Información del Certificado</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Número:</strong> {certificateData.certificateNumber}</p>
                <p><strong>Formato:</strong> 1200x800 px (PNG/PDF)</p>
                <p><strong>Plantilla:</strong> {templates.find(t => t.id === selectedTemplate)?.name}</p>
                <p><strong>Fecha de emisión:</strong> {new Date().toLocaleDateString('es-ES')}</p>
              </div>
            </div>
          </div>

          {/* Vista previa del certificado */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Vista Previa</h2>
            
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <canvas
                ref={canvasRef}
                className="w-full max-w-full h-auto border border-gray-300 rounded bg-white"
                style={{ aspectRatio: '3/2' }}
              />
            </div>

            {generatedCertificate && (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✅</span>
                    <span className="text-green-800 font-medium">
                      Certificado generado exitosamente
                    </span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    El certificado está listo para descargar en formato PNG o PDF
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(generatedCertificate, '_blank')}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition duration-200"
                  >
                    👁️ Ver en Nueva Ventana
                  </button>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCertificate);
                      alert('Imagen copiada al portapapeles');
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200"
                  >
                    📋 Copiar Imagen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
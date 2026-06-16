import { useEffect, useState } from 'react';
import NuevaEmpresaModal from '@components/NuevaEmpresaModal/NuevaEmpresaModal';
import { useEmpresa } from '@context/EmpresaContext.tsx';
import { 
  FaBuilding, 
  FaPlus, 
  FaFileLines, 
  FaEnvelope, 
  FaPhone, 
  FaMapPin, 
  FaBriefcase, 
  FaFingerprint, 
  FaGlobe, 
  FaArrowRight 
} from 'react-icons/fa6';
import type { EmpresaResponse } from '@models/Empresa.ts';
import './Empresa.css';

const API_BASE = 'http://localhost:8080/api/v1/facturacion/empresa';

export default function Empresa() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [empresas, setEmpresas] = useState<EmpresaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedEmpresaId, setSelectedEmpresaId } = useEmpresa();

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      const json = await res.json();
      setEmpresas(json.data ?? []);
    } catch (err) {
      console.error('Error al cargar empresas:', err);
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const hasEmpresas = empresas.length > 0;

  return (
    <section className="empresa__section">
      <div className="empresa__top">
        <div className="empresa__titleWrap">
          <div className="empresa__iconBox">
            <FaBuilding className="empresa__titleIcon" />
          </div>
          <div>
            <h2 className="empresa__title">Mis Empresas</h2>
            <p className="empresa__subtitle">
              Datos de las empresas emisoras de facturas
            </p>
          </div>
        </div>

        <button
          type="button"
          className="empresa__newButton"
          onClick={() => setModalAbierto(true)}
        >
          <FaPlus />
          <span>Nueva Empresa</span>
        </button>
      </div>

      {loading ? (
        <div className="empresa__emptyPanel">
          <p className="empresa__emptyText">Cargando empresas...</p>
        </div>
      ) : !hasEmpresas ? (
        <div className="empresa__emptyPanel">
          <div className="empresa__emptyIconWrap">
            <FaFileLines className="empresa__emptyIcon" />
          </div>
          <h3 className="empresa__emptyTitle">
            No hay empresas registradas
          </h3>
          <p className="empresa__emptyText">
            Registra los datos de tu empresa para poder emitir facturas
            correctamente
          </p>
          <button
            type="button"
            className="empresa__emptyButton"
            onClick={() => setModalAbierto(true)}
          >
            <FaPlus />
            <span>Registrar Primera Empresa</span>
          </button>
        </div>
      ) : (
        <div className="empresa__grid">
          {empresas.map((emp, index) => {
            const styleIndex = index % 4;
            const isActive = emp.id === selectedEmpresaId;
            return (
              <div 
                key={emp.id} 
                className={`empresa__card empresa__card--style-${styleIndex} ${isActive ? 'empresa__card--active' : ''}`}
                onClick={() => setSelectedEmpresaId(emp.id)}
                title="Hacer clic para seleccionar esta empresa"
              >
                <div className="empresa__cardBadge">
                  {isActive ? (
                    <span className="empresa__badgeActive">Activa</span>
                  ) : (
                    <>
                      <FaGlobe className="empresa__badgeIcon" />
                      <span>{emp.ciudad || emp.pais || 'El Salvador'}</span>
                    </>
                  )}
                </div>

                <div className="empresa__cardHeader">
                  <div className="empresa__cardIconBox">
                    <FaBuilding className="empresa__cardIcon" />
                  </div>
                  <div className="empresa__cardInfo">
                    <h3 className="empresa__cardName" title={emp.razon_social || emp.razonSocial || emp.nombre_legal || emp.nombreLegal || emp.nombre_comercial || emp.nombreComercial}>
                      {emp.razon_social || emp.razonSocial || emp.nombre_legal || emp.nombreLegal || emp.nombre_comercial || emp.nombreComercial || 'Empresa Registrada'}
                    </h3>
                    <p className="empresa__cardCommercial">
                      {emp.nombre_comercial || emp.nombreComercial || 'Sede Principal'}
                    </p>
                  </div>
                </div>

                <div className="empresa__cardBody">
                  <div className="empresa__cardRow">
                    <span className="empresa__cardLabel">
                      <FaFingerprint className="empresa__rowIcon" />
                      <span>NIT</span>
                    </span>
                    <span className="empresa__cardValue">{emp.nit}</span>
                  </div>
                  {emp.email && (
                    <div className="empresa__cardRow">
                      <span className="empresa__cardLabel">
                        <FaEnvelope className="empresa__rowIcon" />
                        <span>Email</span>
                      </span>
                      <span className="empresa__cardValue" title={emp.email}>{emp.email}</span>
                    </div>
                  )}
                  {emp.telefono && (
                    <div className="empresa__cardRow">
                      <span className="empresa__cardLabel">
                        <FaPhone className="empresa__rowIcon" />
                        <span>Teléfono</span>
                      </span>
                      <span className="empresa__cardValue">{emp.telefono}</span>
                    </div>
                  )}
                  {emp.direccion && (
                    <div className="empresa__cardRow">
                      <span className="empresa__cardLabel">
                        <FaMapPin className="empresa__rowIcon" />
                        <span>Dirección</span>
                      </span>
                      <span className="empresa__cardValue" title={emp.direccion}>
                        {emp.direccion}
                      </span>
                    </div>
                  )}
                  {(emp.actividad_economica || emp.actividadEconomica) && (
                    <div className="empresa__cardRow">
                      <span className="empresa__cardLabel">
                        <FaBriefcase className="empresa__rowIcon" />
                        <span>Giro/Actividad</span>
                      </span>
                      <span className="empresa__cardValue" title={emp.actividad_economica || emp.actividadEconomica}>
                        {emp.actividad_economica || emp.actividadEconomica}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NuevaEmpresaModal
        isOpen={modalAbierto}
        setIsOpen={setModalAbierto}
        onCreated={fetchEmpresas}
      />
    </section>
  );
}

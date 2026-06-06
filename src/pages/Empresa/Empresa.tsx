import { useEffect, useState } from 'react';
import NuevaEmpresaModal from '@components/NuevaEmpresaModal/NuevaEmpresaModal';
import { FaBuilding, FaPlus, FaFileLines } from 'react-icons/fa6';
import type { EmpresaResponse } from '@models/Empresa.ts';
import './Empresa.css';

const API_BASE = 'http://localhost:8080/api/v1/facturacion/empresa';

export default function Empresa() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [empresas, setEmpresas] = useState<EmpresaResponse[]>([]);
  const [loading, setLoading] = useState(true);

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
          {empresas.map((emp) => (
            <div key={emp.id} className="empresa__card">
              <div className="empresa__cardHeader">
                <div className="empresa__cardIconBox">
                  <FaBuilding className="empresa__cardIcon" />
                </div>
                <div className="empresa__cardInfo">
                  <h3 className="empresa__cardName">
                    {emp.razon_social || emp.nombre_legal}
                  </h3>
                  {emp.nombre_comercial && (
                    <p className="empresa__cardCommercial">
                      {emp.nombre_comercial}
                    </p>
                  )}
                </div>
              </div>

              <div className="empresa__cardBody">
                <div className="empresa__cardRow">
                  <span className="empresa__cardLabel">NIT</span>
                  <span className="empresa__cardValue">{emp.nit}</span>
                </div>
                {emp.email && (
                  <div className="empresa__cardRow">
                    <span className="empresa__cardLabel">Email</span>
                    <span className="empresa__cardValue">{emp.email}</span>
                  </div>
                )}
                {emp.telefono && (
                  <div className="empresa__cardRow">
                    <span className="empresa__cardLabel">Teléfono</span>
                    <span className="empresa__cardValue">
                      {emp.telefono}
                    </span>
                  </div>
                )}
                {emp.direccion && (
                  <div className="empresa__cardRow">
                    <span className="empresa__cardLabel">Dirección</span>
                    <span className="empresa__cardValue">
                      {emp.direccion}
                    </span>
                  </div>
                )}
                {emp.actividad_economica && (
                  <div className="empresa__cardRow">
                    <span className="empresa__cardLabel">Actividad</span>
                    <span className="empresa__cardValue">
                      {emp.actividad_economica}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
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

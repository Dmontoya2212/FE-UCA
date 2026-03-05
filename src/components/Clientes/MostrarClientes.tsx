import "./MostrarClientes.css";
import type { Cliente } from "../../models/cliente.model";
import { FaEdit, FaTrash } from "react-icons/fa";

type Props = {
    clientes: Cliente[];
    onEdit?: (cliente: Cliente) => void;
    onDelete?: (cliente: Cliente) => void;
};

export default function MostrarClientes({ clientes, onEdit, onDelete }: Props) {
    return (
        <section className="mc">
            <div className="mc__tableWrap">
                <table className="mc__table">
                    <thead>
                        <tr>
                            <th>Nombre/Razón Social</th>
                            <th>NIF/CIF</th>
                            <th>Ciudad</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th className="mc__thActions">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(!clientes || clientes.length === 0) ? (
                            <tr>
                                <td className="mc__emptyCell" colSpan={6}>
                                    No hay clientes para mostrar.
                                </td>
                            </tr>
                        ) : (
                            clientes.map((c) => (
                                <tr key={c.id}>
                                    <td className="mc__strong">{c.nombreRazonSocial}</td>
                                    <td className="mc__muted">{c.nifCif ?? "—"}</td>
                                    <td className="mc__muted">{c.ciudad ?? "—"}</td>
                                    <td className="mc__muted">{c.email ?? "—"}</td>
                                    <td className="mc__muted">{c.telefono ?? "—"}</td>

                                    <td className="mc__actions">
                                        <button
                                            type="button"
                                            className="mc__iconBtn"
                                            onClick={() => onEdit?.(c)}
                                            title="Editar"
                                        >
                                            <FaEdit size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            className="mc__iconBtn mc__iconBtn--danger"
                                            onClick={() => onDelete?.(c)}
                                            title="Eliminar"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
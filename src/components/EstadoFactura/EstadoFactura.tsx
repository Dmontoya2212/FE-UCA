<<<<<<< HEAD
import style from '@components/EstadoFactura/EstadoFactura.module.css';
import { capitalizeText } from '@utils/FormatText.ts';
=======
//A mi no me funciona como esta arriba, el de abajo si
import style from "./EstadoFactura.module.css";
import { capitalizeText } from "../../utils/FormatText";
>>>>>>> feature/Factura_Page

type EstadoFacturaProps = {
  variant: 'pagadas' | 'enviadas' | 'borradores' | 'default';
};

const EstadoFactura = ({ variant }: EstadoFacturaProps) => {
  return (
    <article
      className={`${style.estadoContainer} ${style[`variant_${variant}`]}`}
    >
      <section className={`${style.infoSection}`}>
        <div className={`${style.circle} ${style[`circle_${variant}`]}`}></div>
        <section className={`${style.infoContainer}`}>
          <h5 className={`${style.infoTitle}`}>{capitalizeText(variant)}</h5>
          <p className={`${style.info} ${style[`info_${variant}`]}`}>
            0 facturas
          </p>
        </section>
      </section>
      <section className={`${style.moneySection}`}>
        {variant !== 'borradores' && (
          <h6 className={`${style.moneyAmount}`}>$0.00</h6>
        )}
      </section>
    </article>
  );
};

export default EstadoFactura;

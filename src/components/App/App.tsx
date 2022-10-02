import { FC, useEffect } from 'react'
import { BarLoader } from 'react-spinners'

import { useActions } from '../../hooks/useActions'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { filterTickets, sortTickets } from '../../utils/filters'
import Filter from '../Filter/Filter'
import Tabs from '../Tabs'
import TicketList from '../TicketList'
import logo from '../../assets/img/logo.svg'
import { SortTypes, TicketData } from '../../types'
import { calaculateMaxHeight } from '../../utils/calaculateMaxHeight'

import styles from './App.module.scss'

/* TODO
 *   1. Сделать блок info абсолютным - DONE
 *   2. Маргины задать для табс(точнее для внешнего блока), сделать  - DONE
 *   3. Сделать логику по фильтрам в самом редюсере - Done
 *   4. Сделать скролл только для билетов
 *   5. Попробовать вынести весь fetching в класс
 */

const App: FC = () => {
  const { getTickets, getSearchId, showMoreTickets } = useActions()
  const { tickets, searchId, checkboxes, sort, loading, shownTickets, error } = useTypedSelector((state) => state)
  let height = calaculateMaxHeight()
  useEffect(() => {
    getSearchId()
  }, [])

  useEffect(() => {
    if (!searchId) return

    getTickets(searchId)
  }, [searchId])

  const showedTickets: TicketData[] = sortTickets(filterTickets(tickets, checkboxes), sort)

  const buttons: { type: string; label: string }[] = [
    { type: SortTypes.Cheap, label: 'Самый дешевый' },
    { type: SortTypes.Fast, label: 'Самый быстрый' },
    { type: SortTypes.Optimal, label: 'Оптимальный' },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" />
      </div>

      <div className={styles.wrapper}>
        <aside className={styles.filter}>
          <Filter />
        </aside>

        <main className={styles.main} style={{ height }}>
          <div className={styles.tabWrapper}>
            <Tabs buttons={buttons} />
          </div>

          <div className={styles.info}>
            {error && <div>{error}</div>}
            {!showedTickets.length && !loading && !error && (
              <div className={styles.warning}>Рейсов, подходящих под заданные фильтры, не найдено</div>
            )}
          </div>

          {loading && <BarLoader color="#168cec" width="100%" />}

          <TicketList tickets={showedTickets} />

          {!!showedTickets.length && !loading && shownTickets < showedTickets.length && (
            <button type="button" className={styles.showMoreBtn} onClick={showMoreTickets}>
              Показать еще 5 билетов!
            </button>
          )}
        </main>
      </div>
    </div>
  )
}

export default App

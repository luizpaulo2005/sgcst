import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Button } from './ui/button'
import { TableCell, TableFooter, TableRow } from './ui/table'

interface PaginacaoProps {
  itensPorPagina: number
  setItensPorPagina: (itens: number) => void
  total: number
  paginaAtual: number
  setPaginaAtual: (pagina: number) => void
}

const Paginacao = ({
  itensPorPagina,
  paginaAtual,
  setItensPorPagina,
  setPaginaAtual,
  total,
}: PaginacaoProps) => {
  const totalPaginas = Math.ceil(total / itensPorPagina)

  const primeiraPagina = () => setPaginaAtual(1)
  const ultimaPagina = () => setPaginaAtual(totalPaginas)
  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1)
    }
  }
  const paginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1)
    }
  }

  return (
    <TableFooter className="bg-background">
      <TableRow>
        <TableCell colSpan={4} className="p-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              Mostrando
              <Select
                value={itensPorPagina.toString()}
                onValueChange={(value) => setItensPorPagina(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={itensPorPagina} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              de {total} registros
            </div>
            <div className="flex items-center gap-2">
              <span>
                Página {paginaAtual} de {totalPaginas}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={primeiraPagina}
                disabled={paginaAtual === 1}
              >
                <ChevronsLeft className="cursor-pointer" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={paginaAnterior}
                disabled={paginaAtual === 1}
              >
                <ChevronLeft className="cursor-pointer" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={proximaPagina}
                disabled={paginaAtual === totalPaginas}
              >
                <ChevronRight className="cursor-pointer" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={ultimaPagina}
                disabled={paginaAtual === totalPaginas}
              >
                <ChevronsRight className="cursor-pointer" />
              </Button>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  )
}

export { Paginacao }

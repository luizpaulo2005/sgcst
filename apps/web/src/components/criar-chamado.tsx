'use client'

import { Plus } from 'lucide-react'

import { useIsMobile } from '@/hooks/use-mobile'

import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Textarea } from './ui/textarea'

interface CriarChamadoProps {
  categorias: Array<{ id: string; descricao: string }>
  locais: Array<{ id: string; nome: string; avatarUrl?: string | null }>
}

const CriarChamado = ({ categorias, locais }: CriarChamadoProps) => {
  const isMobile = useIsMobile()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={isMobile ? 'icon' : 'default'} variant="outline">
          <Plus />
          {!isMobile && 'Abrir chamado'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Abrir chamado</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          {/* {success === false && message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Erro ao criar convite!</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )} */}
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              type="text"
              name="titulo"
              id="titulo"
              placeholder="Título do chamado"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              name="descricao"
              id="descricao"
              placeholder="Descrição do chamado (opcional)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select name="prioridade">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BAIXA">Baixa</SelectItem>
                <SelectItem value="MEDIA">Média</SelectItem>
                <SelectItem value="ALTA">Alta</SelectItem>
                <SelectItem value="URGENTE">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="local">Local</Label>
            <Select name="local">
              <SelectTrigger className="w-full overflow-hidden">
                <SelectValue
                  placeholder="Selecione um local"
                  className="w-full truncate text-ellipsis whitespace-nowrap"
                />
              </SelectTrigger>
              <SelectContent>
                {locais.map((local) => (
                  <SelectItem
                    key={local.id}
                    value={local.id}
                    className="capitalize"
                  >
                    {local.avatarUrl && (
                      <img
                        src={local.avatarUrl}
                        alt={local.nome}
                        className="size-4 rounded-full"
                      />
                    )}
                    {local.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select name="categoria">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem
                    key={categoria.id}
                    value={categoria.id}
                    className="capitalize"
                  >
                    {categoria.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { CriarChamado }

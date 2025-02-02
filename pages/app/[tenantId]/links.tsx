import NextLink from "next/link"
import { useRouter } from "next/router"

import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'

import * as yup from "yup"

import { Link } from '@prisma/client'

import AlertComponent from "components/Alert"
import Subtitle from "components/Headings/Subtitle"
import Title from "components/Headings/Title"

import { useGet } from "hooks/api"

import { fetchPost, fetchDelete } from "lib/fetch"

import { LinkPaginationWrapper } from "services/links"

type NewLinkForm = {
  name: string
  publicName: string
  slug: string
  destination: string
  appLink: string
}

const newLinkSchema = yup.object({
  name: yup.string().required(),
  publicName: yup.string().required(),
  slug: yup.string().required(),
  destination: yup.string().required(),
  appLink: yup.string().required()
}).required()

const Links = () => {
  const router = useRouter()
  const tenantId = router?.query?.tenantId
  const cursor = router?.query?.cursor ? `?cursor=${router?.query?.cursor}` : ''

  const { handleSubmit, register, formState: { errors } } = useForm<NewLinkForm>({
    resolver: yupResolver(newLinkSchema)
  })

  const { data, mutate } =
    useGet<LinkPaginationWrapper>(tenantId && `/api/${router?.query?.tenantId}/links${cursor}`)

  const submit: SubmitHandler<NewLinkForm> = async (inputs: NewLinkForm) => {
    await fetchPost({ url: `api/${tenantId}/links`, data: inputs })

    await mutate()
  }

  const deleteLink = async (id: string) => {
    await fetchDelete({ url: `api/${tenantId}/links/${id}` })

    await mutate()
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <Title>Gerenciador de links</Title>
          <Subtitle>Gerenciador de links</Subtitle>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            className={`w-full border-l border-t border-b text-base font-medium rounded-l-md text-black bg-white 
          hover:bg-gray-100 px-4 py-2`}
          >
            Criar link
          </button>
          <button
            type="button"
            className="w-full border text-base font-medium text-black bg-white hover:bg-gray-100 px-4 py-2"
          >
            Criar grupo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)} className="container w-full mx-auto md:w-3/4 mt-8">
        <div className="p-4 bg-gray-100 border-t-2 border-indigo-400 rounded-lg bg-opacity-5">
          <div className="max-w-sm mx-auto md:w-full md:mx-0">
            <div className="inline-flex items-center space-x-4">
              <Subtitle>Criar link</Subtitle>
            </div>
          </div>
        </div>
        <div className="space-y-6 bg-white">
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <h2 className="max-w-sm mx-auto md:w-1/3">
              Identificação
            </h2>
            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    className={`rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full 
                    py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none 
                    focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="Nome interno"
                    {...register("name")}
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="text"
                    className={`rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full 
                    py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none
                    focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="Nome público"
                    {...register("publicName")}
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="user-info-name"
                    className={`rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full 
                    py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none 
                    focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="Identificador (slug)"
                    {...register("slug")}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <h2 className="max-w-sm mx-auto md:w-1/3">
              Destino
            </h2>
            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    className={`rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full 
                    py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none 
                    focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="https://"
                    {...register("destination")}
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="text"
                    className={`rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full 
                    py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none 
                    focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="Link para app"
                    {...register("appLink")}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
            <button
              type="submit"
              className={`py-2 px-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 
              focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center 
              text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg`}
            >
              Salvar
            </button>
          </div>
        </div>
      </form>

      {data && data?.items?.length === 0 ?
        <AlertComponent showIcon={false}>Nenhum link cadastrado</AlertComponent> :
        (
          <div className="container w-full mx-auto md:w-3/4 mt-8">
            <div className="py-8">
              <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">
                <h2 className="text-2xl leading-tight">
                  Links
                </h2>
                <div className="text-end">
                  <form className="flex flex-col md:flex-row w-3/4 md:w-full max-w-sm md:space-x-3 space-y-3 md:space-y-0 justify-center">
                    <div className=" relative ">
                      <input type="text" id="&quot;form-subscribe-Filter" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Digite o termo que está buscando" />
                    </div>
                    <button className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200" type="submit">
                      Filtrar
                    </button>
                  </form>
                </div>
              </div>
              <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                          Nome
                        </th>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                          Identificador
                        </th>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                          Destino
                        </th>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                          Criado em
                        </th>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                          Situação
                        </th>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data && data?.items?.map((link: Link) => (
                        <tr key={link.id}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <div className="flex items-center">
                              <div className="ml-3">
                                <p className="text-gray-900 whitespace-no-wrap">
                                  {link.name}
                                  <br />
                                  <span className="text-xs text-gray-500">{link.publicName}</span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {link.slug}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {link.destination}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {new Date(link.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                              <span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full">
                              </span>
                              <span className="relative">
                                ativo
                              </span>
                            </span>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <a href="#" className="text-indigo-600 hover:text-indigo-900">
                              Editar
                            </a>
                            <button onClick={() => deleteLink(link.id)}>Remover</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-5 bg-white py-5 flex flex-col xs:flex-row items-center xs:justify-between">
                    <div className="flex items-center">
                      <NextLink href={`/app/${tenantId}/links?cursor=${data?.prevCursor}`}>
                        <button
                          type="button"
                          className="w-full p-4 border text-base rounded-l-xl text-gray-600 bg-white hover:bg-gray-100"
                          disabled={!data?.prevCursor}
                        >
                          <svg width={9} fill="currentColor" height={8} viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z">
                            </path>
                          </svg>
                        </button>
                      </NextLink>

                      <NextLink href={`/app/${tenantId}/links?cursor=${data?.nextCursor}`}>
                        <button
                          type="button"
                          className="w-full p-4 border text-base rounded-r-xl text-gray-600 bg-white hover:bg-gray-100"
                          disabled={!data?.nextCursor}
                        >
                          <svg width={9} fill="currentColor" height={8} viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z">
                            </path>
                          </svg>
                        </button>
                      </NextLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  )
}

export default Links
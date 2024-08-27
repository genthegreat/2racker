import Spinner from '@/components/spinner/Spinner'


export default function loading() {
  return (
      <div className='flex flex-col justify-center items-center'>
          <Spinner />
          <span>loading...</span>
      </div>
  )
}

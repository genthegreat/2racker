import PaidTotal from "@/components/paidTotal/paidTotal"

export default function Home() {
  return (
    <div className="flex flex-col text-center justify-center mx-auto">
        <PaidTotal />

        <div>Loading Bar</div>

        <div className="text-center mt-5">
            <h2>To Pay</h2>
            <span className="text-2xl">k25,000</span>
        </div>
    </div>
  )
}
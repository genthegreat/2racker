export const SingleCard = ({
    image,
    Button,
    CardDescription,
    CardTitle,
    titleHref,
    btnHref,
}: any) => {
    return (
        <div className="overflow-hidden rounded-lg shadow-black shadow-sm duration-300 hover:shadow-md hover:shadow-slate-800 flex flex-col h-full">
            {image && (<img src={image} alt="" className="w-full" />)}
            <div className="p-8 text-center sm:p-9 md:p-7 xl:p-9">
                <h3 className="mb-4 block text-xl font-semibold text-dark hover:text-primary sm:text-[22px] md:text-xl lg:text-[22px] xl:text-xl 2xl:text-[22px]">
                    {titleHref ? (
                        <a
                            href={titleHref}
                        >
                            {CardTitle}
                        </a>
                    ) :
                        CardTitle
                    }
                </h3>
                <p className="mb-7 text-justify text-base sm:text-[16px] md:text-[18px] text-gray-600">
                    {CardDescription}
                </p>

                {Button && (
                    <a
                        href={btnHref ? btnHref : "#"}
                        className="inline-block rounded-full border border-gray-3 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-white"
                    >
                        {Button}
                    </a>
                )}
            </div>
        </div>
    );
};
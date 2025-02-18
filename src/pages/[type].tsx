import React from "react";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Modal } from "@redq/reuse-modal";
import Carousel from "components/carousel/carousel";
import { Banner } from "components/banner/banner";
import { MobileBanner } from "components/banner/mobile-banner";

import {
    MainContentArea,
    SidebarSection,
    ContentSection,
    OfferSection,
    MobileCarouselDropdown,
} from "assets/styles/pages.style";
// Static Data Import Here
import { siteOffers } from "site-settings/site-offers";
import { sitePages } from "site-settings/site-pages";
import { SEO } from "components/seo";
import { useRefScroll } from "utils/use-ref-scroll";
import { initializeApollo } from "utils/apollo";
import { GET_PRODUCTS } from "graphql/query/products.query";
import { GET_CATEGORIES } from "graphql/query/category.query";
import { ModalProvider } from "contexts/modal/modal.provider";
import { GET_SHOES, SEARCH_SHOES } from "graphql/query/shoes.query";


const Sidebar = dynamic(() => import("layouts/sidebar/sidebar"));
const Products = dynamic(() => import("components/product-grid/product-list/product-list"));
const CartPopUp = dynamic(() => import("features/carts/cart-popup"), {
    ssr: false,
});

const CategoryPage: React.FC<any> = ({ deviceType }) => {
    const { query } = useRouter();

    const { elRef: targetRef, scroll } = useRefScroll({
        percentOfElement: 0,
        percentOfContainer: 0,
        offsetPX: -110,
    });

    console.log('scroll : ', scroll);

    React.useEffect(() => {
        if (query.text || query.category) {
            scroll();
        }
    }, [query.text, query.category]);


    const PAGE_TYPE: any = query.type;
    const page = sitePages[PAGE_TYPE];


    console.log({ deviceType });

    return (
        <>
            <SEO title={page?.page_title} description={page?.page_description} />
            <ModalProvider>
                <Modal>

                    <OfferSection>
                        <div style={{ margin: "0 -10px" }}>
                            <Carousel deviceType={deviceType} data={siteOffers} />
                        </div>
                    </OfferSection>
                    <MobileCarouselDropdown>
                        <Sidebar type={PAGE_TYPE} deviceType={deviceType} />
                    </MobileCarouselDropdown>

                    <MainContentArea>
                        <SidebarSection>
                            <Sidebar type={PAGE_TYPE} deviceType={deviceType} />
                        </SidebarSection>
                        <ContentSection>
                            <div ref={targetRef}>
                                <Products type={PAGE_TYPE} deviceType={deviceType} fetchLimit={20} />
                            </div>
                        </ContentSection>
                    </MainContentArea>


                    <CartPopUp deviceType={deviceType} />
                </Modal>
            </ModalProvider>
        </>
    );
};
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const apolloClient = initializeApollo();

    // console.log(params);

    // await apolloClient.query({
    //   query: GET_PRODUCTS,
    //   variables: {
    //     type: params.type,
    //     offset: 0,
    //     limit: 20,
    //   },
    // });

    // await apolloClient.query({
    //   query: GET_CATEGORIES,
    //   variables: {
    //     type: params.type,
    //   },
    // });

    // await apolloClient.query({
    //   query: SEARCH_SHOES,
    //   variables: {
    //     pageSize: 25,
    //     pageNumber: 1,
    //     searchTerm: params.searchTerm
    //   }
    // })

    // await apolloClient.query({
    //   query: GET_SHOES,
    //   variables: {
    //     pageSize: 25,
    //     pageNumber: 1,
    //   },
    // });
    // console.log(apolloClient.cache.extract());

    return {
        props: {
            initialApolloState: apolloClient.cache.extract(),
        },
        revalidate: 1,
    };
};

export async function getStaticPaths() {
    return {
        paths: [{ params: { type: "shoes" } }],
        fallback: false,
    };
}
export default CategoryPage;

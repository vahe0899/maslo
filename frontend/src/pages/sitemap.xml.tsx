import { GetServerSideProps } from 'next';

const HOST = process.env.NEXT_PUBLIC_HOST;

function generateSiteMap() {
    return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       <url>
         <loc>${HOST}</loc>
       </url>
     </urlset>
   `;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    // We make an API call to gather the URLs for our site

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap();

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
};

export default SiteMap;

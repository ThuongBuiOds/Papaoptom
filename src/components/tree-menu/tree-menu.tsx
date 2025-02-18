import React, { useState, useEffect } from 'react';
import { usePrevious, useMeasure } from 'utils/hooks';
import { useSpring, animated } from 'react-spring';
import { Frame, Title, Content, Header, IconWrapper } from './tree-menu.style';
import { Button } from 'components/button/button';
import { ArrowNext } from 'assets/icons/ArrowNext';
import * as icons from 'assets/icons/category-icons';
import { FilterCheckBox, FilterSliderRange } from '../FilterCategory'
// Tree component 
const Tree = React.memo(
    ({
        children,
        name,
        icon,
        onClick,
        dropdown,
        depth,
        defaultOpen = false,
    }: any) => {
        const [isOpen, setOpen] = useState(defaultOpen);

        useEffect(() => {
            setOpen(defaultOpen);
        }, [defaultOpen]);

        const previous = usePrevious(isOpen);

        const [bind, { height: viewHeight }] = useMeasure();

        const { height, opacity, transform } = useSpring<any>({
            from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
            to: {
                height: isOpen ? viewHeight : 0,
                opacity: isOpen ? 1 : 0,
                transform: `translate3d(${isOpen ? 0 : 20}px,0,0)`,
            },
        });

        const Icon = ({ iconName, style }: { iconName: any; style?: any }) => {
            const TagName = icons[iconName];
            return !!TagName ? (
                <TagName style={style} />
            ) : (
                <p>Invalid icon {iconName}</p>
            );
        };


        return (
            <Frame depth={depth} title='1 --CATE' onClick={() => setOpen(!isOpen)} >
                <Header title='TITLE FILTER' open={isOpen} depth={depth} className={depth} >
                    {icon && (
                        <IconWrapper depth={depth}>
                            <Icon iconName={icon} />
                        </IconWrapper>
                    )}
                    {/* <Title onClick={onClick}>{name}</Title> */}
                    <Title>{name}</Title>

                    {dropdown === true && (
                        <Button
                            onClick={() => setOpen(!isOpen)}
                            variant="text"
                            className="toggleButton"
                        >
                            <ArrowNext width="16px" />
                        </Button>
                    )}
                </Header>
                <Content
                    title='FILTER OPTION Ở ĐẤY'
                    style={{
                        opacity,
                        height: isOpen && previous === isOpen ? 'auto' : height,
                        marginTop: isOpen && '15px'
                    }}
                >
                    <animated.div style={{ transform }} {...bind} children={children} />
                </Content>
            </Frame>
        );
    }
);

type Props = {
    className?: any;
    data: any;
    onClick: (slug: string) => void;
    active: string | string[];
};


export const TreeMenu: React.FC<Props> = ({
    data,
    onClick,
    active,
}) => {


    console.log('data cate : ', data.map(x => x.title));

    // function thực hiện render cate
    // created by tuanva 
    const handlerRenderCate = (children) => {

        return children.map((subOption) => {
            // nếu không có children thì gọi vào bên dưới
            if (!subOption.children) {
                return (
                    <Tree
                        key={subOption.title}
                        name={subOption.title}
                        icon={subOption.icon}
                        depth="child"
                        onClick={() => onClick(subOption.slug)}
                        defaultOpen={active === subOption.slug}
                    />
                );
            }
            return (
                <Tree
                    key={subOption.title}
                    name={subOption.title}
                    icon={subOption.icon}
                    dropdown={!subOption.children.length ? false : true}
                    depth="parent"
                    onClick={() => onClick(subOption.slug)}
                    defaultOpen={
                        active === subOption.slug ||
                        subOption.children.some((item) => item.slug === active)
                    }
                >

                    {subOption.title === 'Размер (на фото)' ?
                        <FilterSliderRange />
                        :
                        <>
                            {subOption.children.map((item, index) => {
                                return <FilterCheckBox key={index} value={item.title} />
                            })}
                        </>}


                </Tree >
            );
        });
    };


    return <>{handlerRenderCate(data)}</>;
};





import { Stack, Typography } from "@mui/material"
import { Centered, RowStack, StyledImage } from "../../../../../modules/components"
import { pxToRem } from "../../../../../../common"
import { StaticImageData } from "next/image"

type CardComponentProps = {
    top : {
        icon: StaticImageData;
        iconBg: string;
        badgeIcon: StaticImageData;
        badgeBg: string;
        volumeColor: string;
        volumeNum: string;
    },
    bottom: {
        cardNum: string;
        cardDesc: string
    }
}

export const CardComponent = ({
    top,
    bottom
}: CardComponentProps) => {
    return (
        <Stack
         sx={{
            padding: '20.67px',
            background: (theme) => theme.palette.background.default,
            borderRadius: '16px',
            border: '0.67px solid #F0F4F8',
            boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.06)",
         }}
         spacing={2}
        >
            <RowStack
             justifyContent={"space-between"}
             width={"100%"}
            >
                <Centered
                 sx={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    background: `${top.iconBg}`
                 }}
                >
                    <StyledImage 
                        src={top.icon}
                        alt="icon"
                        sx={{
                            width: '20px',
                            height: '20px'
                        }}
                    />
                </Centered>
                <RowStack
                 sx={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    background: top.badgeBg
                 }}
                 spacing={.5}
                >
                    <StyledImage
                     src={top.badgeIcon}
                     alt="trend" 
                     sx={{
                        width: '12px',
                        height: '12px'
                     }}
                    />
                    <Typography
                     sx={{
                        color: `${top.volumeColor}`,
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontStyle: 'semibold',
                        fontSize: pxToRem(12),
                        lineHeight: '18px'
                     }}
                    >{top.volumeNum}</Typography>
                </RowStack>
            </RowStack>
            <Stack spacing={"6px"}>
                <Typography
                 sx={{
                    fontWeight: 700,
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontSize: pxToRem(28),
                    lineHeight: '28px',
                    fontStyle: 'bold',
                    color: (theme) => theme.color.deepBlue
                 }}
                >{bottom.cardNum}</Typography>
                <Typography
                 sx={{
                    fontWeight: 400,
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontSize: pxToRem(13),
                    lineHeight: '19.5px',
                    fontStyle: 'regular',
                    color: "text.secondary"
                 }}
                >{bottom.cardDesc}</Typography>
            </Stack>
        </Stack>
    )
}

import { useEffect, useMemo, useState } from "react";
import { Box, Button, Menu, MenuItem, Tooltip } from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

enum Flag {
  en = "us",
  ua = "ua",
}

export const SwitchLanguage = () => {
  const { t } = useTranslation();

  const [isReady, setIsReady] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Flag>(Flag.en);

  useEffect(() => {
    const defaultLanguage = localStorage.getItem("i18nextLng");
    setSelectedLanguage(Flag[defaultLanguage as keyof typeof Flag]);
    setIsReady(true);
  }, []);

  const isOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectLanguage = (flag: string) => {
    i18n.changeLanguage(flag);
    setSelectedLanguage(Flag[flag as keyof typeof Flag]);
    setAnchorEl(null);
  };
  const handleClose = () => setAnchorEl(null);

  if (!isReady) return null;

  return (
    <>
      <Tooltip title="Account settings">
        <Button
          variant="text"
          onClick={handleLanguageClick}
          size="small"
          sx={{ ml: 2, minWidth: "40px" }}
          aria-controls={isOpen ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isOpen ? "true" : undefined}
        >
          <ReactCountryFlag
            style={{
              fontSize: "2em",
              lineHeight: "2em",
            }}
            countryCode={selectedLanguage}
            svg
          />
        </Button>
      </Tooltip>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
      >
        {Object.keys(Flag).map((flag) => {
          const flagCode = Flag[flag as keyof typeof Flag];
          return (
            <MenuItem
              key={flagCode}
              selected={selectedLanguage === flag}
              onClick={(e) => handleSelectLanguage(flag)}
            >
              <Box display="flex" alignItems="center">
                <ReactCountryFlag
                  style={{
                    fontSize: "1.3em",
                    lineHeight: "1.3em",
                    marginRight: "4px",
                  }}
                  countryCode={flagCode}
                  svg
                />
                {t(flagCode)}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
